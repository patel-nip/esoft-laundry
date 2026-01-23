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

router.get("/", authRequired, listCustomers);
router.get("/:id", authRequired, getCustomer);
router.post("/", authRequired, addCustomer);
router.put("/:id", authRequired, editCustomer);
router.delete("/:id", authRequired, removeCustomer);

module.exports = router;
