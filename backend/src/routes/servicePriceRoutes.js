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
const { checkPermission } = require("../middleware/checkPermission");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// ✅ All routes protected with service_prices permission
router.get("/", authRequired, checkPermission('service_prices'), listServicePrices);
router.get("/:id", authRequired, checkPermission('service_prices'), getServicePrice);
router.post("/", authRequired, checkPermission('service_prices'), addServicePrice);
router.put("/:id", authRequired, checkPermission('service_prices'), editServicePrice);
router.delete("/:id", authRequired, checkPermission('service_prices'), removeServicePrice);

module.exports = router;
