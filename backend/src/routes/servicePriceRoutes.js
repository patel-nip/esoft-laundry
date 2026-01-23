const express = require("express");
const router = express.Router();
const {
    listServicePrices,
    getServicePrice,
    addServicePrice,
    editServicePrice,
    removeServicePrice
} = require("../controllers/servicePriceController");
const { authRequired } = require("../middleware/authMiddleware");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/", authRequired, listServicePrices);
router.get("/:id", authRequired, getServicePrice);
router.post("/", authRequired, addServicePrice);
router.put("/:id", authRequired, editServicePrice);
router.delete("/:id", authRequired, removeServicePrice);

module.exports = router;
