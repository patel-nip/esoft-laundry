const pool = require("../config/db");
const { getItemsByOrderId } = require("../models/orderItemModel");
const { getPaymentsByOrderId } = require("../models/paymentModel");

// GET /api/reports/services?from=YYYY-MM-DD&to=YYYY-MM-DD
async function getServicesReport(req, res) {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: "From and To dates are required" });
        }

        const [orders] = await pool.query(
            `SELECT o.*, c.name as customer_name, c.rnc as customer_rnc
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.order_date BETWEEN ? AND ?
       ORDER BY o.order_date DESC`,
            [from, to]
        );

        let totalSubtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;
        let totalAmount = 0;
        let totalCash = 0;
        let totalCard = 0;
        let totalTransfer = 0;

        for (let order of orders) {
            const payments = await getPaymentsByOrderId(order.id);

            order.cash = 0;
            order.card = 0;
            order.transfer = 0;

            payments.forEach(p => {
                if (p.payment_method === 'CASH') order.cash += parseFloat(p.amount);
                if (p.payment_method === 'CARD') order.card += parseFloat(p.amount);
                if (p.payment_method === 'TRANSFER') order.transfer += parseFloat(p.amount);
            });

            totalSubtotal += parseFloat(order.subtotal);
            totalTax += parseFloat(order.tax);
            totalDiscount += parseFloat(order.discount);
            totalAmount += parseFloat(order.total);
            totalCash += order.cash;
            totalCard += order.card;
            totalTransfer += order.transfer;
        }

        res.json({
            orders,
            summary: {
                totalSubtotal,
                totalTax,
                totalDiscount,
                totalAmount,
                totalCash,
                totalCard,
                totalTransfer,
            }
        });
    } catch (err) {
        console.error("Services report error:", err);
        res.status(500).json({ message: "Error generating services report" });
    }
}

// GET /api/reports/orders-by-date?date=YYYY-MM-DD
async function getOrdersByDate(req, res) {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        const [orders] = await pool.query(
            `SELECT o.code, o.eta_date, c.name as customer_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.order_date = ?
       ORDER BY o.order_time DESC`,
            [date]
        );

        for (let order of orders) {
            const items = await getItemsByOrderId(order.id);
            order.items_count = items.reduce((sum, item) => sum + item.qty, 0);
            order.items_summary = items.map(i => `${i.qty} ${i.garment_name}`).join(', ');
        }

        res.json({ orders });
    } catch (err) {
        console.error("Orders by date error:", err);
        res.status(500).json({ message: "Error fetching orders by date" });
    }
}

// GET /api/reports/customer/:customerId
async function getCustomerReport(req, res) {
    try {
        const { customerId } = req.params;

        const [orders] = await pool.query(
            `SELECT o.*, c.name as customer_name, c.phone, c.address, c.rnc
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.customer_id = ?
       ORDER BY o.order_date DESC`,
            [customerId]
        );

        let totalAmount = 0;
        let totalCash = 0;
        let totalCard = 0;
        let totalTransfer = 0;

        for (let order of orders) {
            const payments = await getPaymentsByOrderId(order.id);

            order.cash = 0;
            order.card = 0;
            order.transfer = 0;

            payments.forEach(p => {
                if (p.payment_method === 'CASH') order.cash += parseFloat(p.amount);
                if (p.payment_method === 'CARD') order.card += parseFloat(p.amount);
                if (p.payment_method === 'TRANSFER') order.transfer += parseFloat(p.amount);
            });

            totalAmount += parseFloat(order.total);
            totalCash += order.cash;
            totalCard += order.card;
            totalTransfer += order.transfer;
        }

        res.json({
            customer: orders[0] ? {
                name: orders[0].customer_name,
                phone: orders[0].phone,
                address: orders[0].address,
                rnc: orders[0].rnc
            } : null,
            orders,
            summary: {
                totalAmount,
                totalCash,
                totalCard,
                totalTransfer,
            }
        });
    } catch (err) {
        console.error("Customer report error:", err);
        res.status(500).json({ message: "Error generating customer report" });
    }
}

// GET /api/reports/completed-orders?from=YYYY-MM-DD&to=YYYY-MM-DD
async function getCompletedOrdersReport(req, res) {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({ message: "From and To dates are required" });
        }

        const [orders] = await pool.query(
            `SELECT o.code, o.order_date, o.total, o.handler, c.name as customer_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.status = 'COMPLETED' AND o.order_date BETWEEN ? AND ?
       ORDER BY o.order_date DESC`,
            [from, to]
        );

        for (let order of orders) {
            const items = await getItemsByOrderId(order.id);
            order.items_count = items.reduce((sum, item) => sum + item.qty, 0);
        }

        res.json({ orders });
    } catch (err) {
        console.error("Completed orders report error:", err);
        res.status(500).json({ message: "Error generating completed orders report" });
    }
}

module.exports = {
    getServicesReport,
    getOrdersByDate,
    getCustomerReport,
    getCompletedOrdersReport,
};
