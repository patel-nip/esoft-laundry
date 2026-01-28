const express = require("express");
const router = express.Router();
const { getConfig, updateConfig, triggerBackup } = require("../controllers/backupController");
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

// ✅ All routes protected with backup permission
router.get("/", authRequired, checkPermission('backup'), getConfig);
router.put("/", authRequired, checkPermission('backup'), updateConfig);
router.post("/trigger", authRequired, checkPermission('backup'), triggerBackup);

module.exports = router;
