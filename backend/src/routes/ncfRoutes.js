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

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/ranges", authRequired, listNCFRanges);
router.get("/ranges/:id", authRequired, getNCFRange);
router.post("/ranges", authRequired, addNCFRange);
router.put("/ranges/:id", authRequired, editNCFRange);

router.get("/config", authRequired, getConfig);
router.put("/config", authRequired, updateConfig);

module.exports = router;
