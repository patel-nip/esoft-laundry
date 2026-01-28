const express = require("express");
const router = express.Router();
const {
    listOrders,
    getOrder,
    addOrder,
    editOrder,
    removeOrder,
    addPaymentToOrder,
} = require("../controllers/orderController");
const { authRequired } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/checkPermission");

// ✅ Apply permission checks to each route
router.get("/", authRequired, checkPermission('order_status'), listOrders);
router.get("/:id", authRequired, checkPermission('order_status'), getOrder);
router.post("/", authRequired, checkPermission('create_order'), addOrder);
router.put("/:id", authRequired, checkPermission('order_status'), editOrder);
router.delete("/:id", authRequired, checkPermission('order_status'), removeOrder);
router.post("/:id/payments", authRequired, checkPermission('invoice_order'), addPaymentToOrder);

module.exports = router;
