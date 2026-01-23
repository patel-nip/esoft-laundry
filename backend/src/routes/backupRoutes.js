const express = require("express");
const router = express.Router();
const { getConfig, updateConfig, triggerBackup } = require("../controllers/backupController");
const { authRequired } = require("../middleware/authMiddleware");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/", authRequired, getConfig);
router.put("/", authRequired, updateConfig);
router.post("/trigger", authRequired, triggerBackup);

module.exports = router;
