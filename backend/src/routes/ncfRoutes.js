const express = require("express");
const router = express.Router();
const {
    listNCFRanges,
    getNCFRange,
    addNCFRange,
    editNCFRange,
    getConfig,
    updateConfig
} = require("../controllers/ncfController");
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

// ✅ All routes protected with tax_receipts permission
router.get("/ranges", authRequired, checkPermission('tax_receipts'), listNCFRanges);
router.get("/ranges/:id", authRequired, checkPermission('tax_receipts'), getNCFRange);
router.post("/ranges", authRequired, checkPermission('tax_receipts'), addNCFRange);
router.put("/ranges/:id", authRequired, checkPermission('tax_receipts'), editNCFRange);

router.get("/config", authRequired, checkPermission('tax_receipts'), getConfig);
router.put("/config", authRequired, checkPermission('tax_receipts'), updateConfig);

module.exports = router;
