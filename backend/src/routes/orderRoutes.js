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

router.get("/", authRequired, listOrders);
router.get("/:id", authRequired, getOrder);
router.post("/", authRequired, addOrder);
router.put("/:id", authRequired, editOrder);
router.delete("/:id", authRequired, removeOrder);
router.post("/:id/payments", authRequired, addPaymentToOrder);

module.exports = router;
