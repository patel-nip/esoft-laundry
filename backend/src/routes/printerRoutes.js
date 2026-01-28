const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/printerController");
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

// ✅ All routes protected with printers permission
router.get("/", authRequired, checkPermission('printers'), getSettings);
router.put("/", authRequired, checkPermission('printers'), updateSettings);

module.exports = router;
