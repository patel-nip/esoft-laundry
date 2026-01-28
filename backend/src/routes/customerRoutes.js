const express = require("express");
const router = express.Router();
const {
    listCustomers,
    getCustomer,
    addCustomer,
    editCustomer,
    removeCustomer,
} = require("../controllers/customerController");
const { authRequired } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/checkPermission");

// ✅ Customers use order_status permission (view) and create_order (create)
router.get("/", authRequired, checkPermission('order_status'), listCustomers);
router.get("/:id", authRequired, checkPermission('order_status'), getCustomer);
router.post("/", authRequired, checkPermission('create_order'), addCustomer);
router.put("/:id", authRequired, checkPermission('order_status'), editCustomer);
router.delete("/:id", authRequired, checkPermission('order_status'), removeCustomer);

module.exports = router;
