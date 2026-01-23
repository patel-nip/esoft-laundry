const express = require("express");
const router = express.Router();
const {
    getServicesReport,
    getOrdersByDate,
    getCustomerReport,
    getCompletedOrdersReport,
} = require("../controllers/reportController");
const { authRequired } = require("../middleware/authMiddleware");

router.get("/services", authRequired, getServicesReport);
router.get("/orders-by-date", authRequired, getOrdersByDate);
router.get("/customer/:customerId", authRequired, getCustomerReport);
router.get("/completed-orders", authRequired, getCompletedOrdersReport);

module.exports = router;
