const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/invoiceSettingsController");
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

// ✅ All routes protected with invoice_message permission
router.get("/", authRequired, checkPermission('invoice_message'), getSettings);
router.put("/", authRequired, checkPermission('invoice_message'), updateSettings);

module.exports = router;
