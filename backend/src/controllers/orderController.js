const {
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
            eta_days,
        } = req.body;

        if (!customer_id || !items || items.length === 0) {
            return res.status(400).json({ message: "Customer and items are required" });
        }

        const now = new Date();
        const orderDate = now.toISOString().split("T")[0];
        const orderTime = now.toTimeString().split(" ")[0];

        const etaDays = eta_days || 3;
        const etaDate = new Date(now);
        etaDate.setDate(etaDate.getDate() + etaDays);
        const etaDateStr = etaDate.toISOString().split("T")[0];

        const orderCode = `ORD${Date.now()}`;
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
        const { status, location, handler, customer_notified, ncf_type, ncf_number } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (location) updateData.location = location;
        if (handler) updateData.handler = handler;
        if (customer_notified) updateData.customer_notified = customer_notified;
        if (ncf_type) updateData.ncf_type = ncf_type;
        if (ncf_number) updateData.ncf_number = ncf_number;

        const order = await updateOrder(req.params.id, updateData);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.items = await getItemsByOrderId(order.id);

        res.json({ message: "Order updated", order });
    } catch (err) {
        console.error("Edit order error:", err);
        res.status(500).json({ message: "Error updating order" });
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
