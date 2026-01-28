const express = require("express");
const router = express.Router();
const {
    getServicesReport,
    getOrdersByDate,
    getCustomerReport,
    getCompletedOrdersReport,
} = require("../controllers/reportController");
const { authRequired } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/checkPermission");

// ✅ All routes protected with reports permission
router.get("/services", authRequired, checkPermission('reports'), getServicesReport);
router.get("/orders-by-date", authRequired, checkPermission('reports'), getOrdersByDate);
router.get("/customer/:customerId", authRequired, checkPermission('reports'), getCustomerReport);
router.get("/completed-orders", authRequired, checkPermission('reports'), getCompletedOrdersReport);

module.exports = router;
