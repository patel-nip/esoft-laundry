const {
    generateOrderCode,
    getAllOrders,
    findOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} = require("../models/orderModel");
const {
    getItemsByOrderId,
    createOrderItem,
    deleteItemsByOrderId,
} = require("../models/orderItemModel");
const {
    getPaymentsByOrderId,
    createPayment,
} = require("../models/paymentModel");
const { getNextNCF, getNCFConfig } = require("../models/ncfRangeModel");

async function listOrders(req, res) {
    try {
        const { status } = req.query;
        const orders = await getAllOrders(status);

        for (let order of orders) {
            order.items = await getItemsByOrderId(order.id);
        }

        res.json({ orders });
    } catch (err) {
        console.error("List orders error:", err);
        res.status(500).json({ message: "Error fetching orders" });
    }
}

async function getOrder(req, res) {
    try {
        const order = await findOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.items = await getItemsByOrderId(order.id);
        order.payments = await getPaymentsByOrderId(order.id);

        res.json({ order });
    } catch (err) {
        console.error("Get order error:", err);
        res.status(500).json({ message: "Error fetching order" });
    }
}

async function addOrder(req, res) {
    try {
        const {
            customer_id,
            items,
            subtotal,
            tax,
            discount,
            total,
            paid,
            notes,
            eta_date,
        } = req.body;

        if (!customer_id || !items || items.length === 0) {
            return res.status(400).json({ message: "Customer and items are required" });
        }

        const now = new Date();
        const orderDate = now.toISOString().split("T")[0];
        const orderTime = now.toTimeString().split(" ")[0];

        let etaDateStr;
        if (eta_date) {
            etaDateStr = eta_date;
        } else {
            const defaultEta = new Date(now);
            defaultEta.setDate(defaultEta.getDate() + 3);
            etaDateStr = defaultEta.toISOString().split("T")[0];
        }

        // ✅ CHANGED: Generate sequential order code
        const orderCode = await generateOrderCode();

        const balance = total - paid;

        const orderId = await createOrder({
            code: orderCode,
            customer_id,
            status: "RECEIVED",
            order_date: orderDate,
            order_time: orderTime,
            eta_date: etaDateStr,
            eta_time: orderTime,
            user_created: req.user?.username || "system",
            subtotal: subtotal || 0,
            tax: tax || 0,
            discount: discount || 0,
            total: total || 0,
            paid: paid || 0,
            balance: balance,
            notes,
        });

        for (let item of items) {
            await createOrderItem({
                order_id: orderId,
                qty: item.qty,
                garment_name: item.garment_name,
                color: item.color,
                service: item.service,
                is_express: item.is_express || "NO",
                price: item.price || 0,
                note: item.note,
            });
        }

        const order = await findOrderById(orderId);
        order.items = await getItemsByOrderId(orderId);

        res.status(201).json({ message: "Order created", order });
    } catch (err) {
        console.error("Add order error:", err);
        res.status(500).json({ message: "Error creating order" });
    }
}

async function editOrder(req, res) {
    try {
        const { status, location, handler, customer_notified, ncf_type } = req.body;

        const updateData = {};
        if (location) updateData.location = location;
        if (handler) updateData.handler = handler;
        if (customer_notified) updateData.customer_notified = customer_notified;

        // ✅ Auto-assign NCF when marking as DELIVERED
        if (status === "DELIVERED") {
            const order = await findOrderById(req.params.id);
            
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Check if order already has NCF
            if (order.ncf_number) {
                return res.status(400).json({ 
                    message: "⚠️ This order already has an NCF assigned. Cannot deliver twice." 
                });
            }

            // Get NCF type (from request or default config)
            let ncfTypeToUse = ncf_type;
            
            if (!ncfTypeToUse || ncfTypeToUse === 'NONE') {
                const config = await getNCFConfig();
                ncfTypeToUse = config?.default_ncf_type || 'B02';
            }

            // Generate NCF number
            try {
                const ncfNumber = await getNextNCF(ncfTypeToUse);
                updateData.ncf_type = ncfTypeToUse;
                updateData.ncf_number = ncfNumber;
                updateData.status = "DELIVERED";
                
                console.log(`✅ NCF assigned: ${ncfNumber} to order ${order.code}`);
            } catch (ncfError) {
                console.error("NCF generation error:", ncfError);
                
                // ✅ IMPROVED: Specific error messages
                let errorMessage = "Failed to generate NCF number.";
                
                if (ncfError.message.includes("No active NCF range")) {
                    errorMessage = `⚠️ No active NCF range found for ${ncfTypeToUse}. Please add an NCF range in Settings → Tax Receipts.`;
                } else if (ncfError.message.includes("exhausted")) {
                    errorMessage = `⚠️ NCF range exhausted for ${ncfTypeToUse}. Please add a new range in Settings → Tax Receipts.`;
                } else {
                    errorMessage = `⚠️ ${ncfError.message}`;
                }
                
                return res.status(400).json({ message: errorMessage });
            }
        } else if (status) {
            updateData.status = status;
        }

        const updatedOrder = await updateOrder(req.params.id, updateData);

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        updatedOrder.items = await getItemsByOrderId(updatedOrder.id);

        res.json({ message: "Order updated", order: updatedOrder });
    } catch (err) {
        console.error("Edit order error:", err);
        res.status(500).json({ message: "Error updating order. Please try again." });
    }
}


async function removeOrder(req, res) {
    try {
        await deleteOrder(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        console.error("Remove order error:", err);
        res.status(500).json({ message: "Error deleting order" });
    }
}

async function addPaymentToOrder(req, res) {
    try {
        const { amount, payment_method } = req.body;

        if (!amount || !payment_method) {
            return res.status(400).json({ message: "Amount and payment method are required" });
        }

        const order = await findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await createPayment({
            order_id: req.params.id,
            amount,
            payment_method,
        });

        const newPaid = parseFloat(order.paid) + parseFloat(amount);
        const newBalance = parseFloat(order.total) - newPaid;

        await updateOrder(req.params.id, {
            paid: newPaid,
            balance: newBalance,
        });

        const updatedOrder = await findOrderById(req.params.id);
        updatedOrder.payments = await getPaymentsByOrderId(req.params.id);

        res.json({ message: "Payment added", order: updatedOrder });
    } catch (err) {
        console.error("Add payment error:", err);
        res.status(500).json({ message: "Error adding payment" });
    }
}

module.exports = {
    listOrders,
    getOrder,
    addOrder,
    editOrder,
    removeOrder,
    addPaymentToOrder,
};
