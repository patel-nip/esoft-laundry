const express = require("express");
const router = express.Router();
const { getCompany, updateCompany } = require("../controllers/companyController");
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

// ✅ All routes protected with company permission
router.get("/", authRequired, checkPermission('company'), getCompany);
router.put("/", authRequired, checkPermission('company'), updateCompany);

module.exports = router;
