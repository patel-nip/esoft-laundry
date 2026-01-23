const express = require("express");
const router = express.Router();
const { getCompany, updateCompany } = require("../controllers/companyController");
const { authRequired } = require("../middleware/authMiddleware");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/", authRequired, getCompany);
router.put("/", authRequired, updateCompany);

module.exports = router;
