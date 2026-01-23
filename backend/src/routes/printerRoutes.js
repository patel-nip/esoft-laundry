const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/printerController");
const { authRequired } = require("../middleware/authMiddleware");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/", authRequired, getSettings);
router.put("/", authRequired, updateSettings);

module.exports = router;
