const express = require("express");
const router = express.Router();
const {
    getPermissionMatrix,
    getRolePermissions,
    updateSinglePermission,
    updateMultiplePermissions
} = require("../controllers/roleController");
const { authRequired } = require("../middleware/authMiddleware");

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/matrix", authRequired, getPermissionMatrix);
router.get("/:role", authRequired, getRolePermissions);
router.put("/permission", authRequired, updateSinglePermission);
router.put("/permissions/bulk", authRequired, updateMultiplePermissions);

module.exports = router;
