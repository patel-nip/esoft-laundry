const express = require("express");
const router = express.Router();
const {
    getPermissionMatrix,
    getRolePermissions,
    updateSinglePermission,
    updateMultiplePermissions
} = require("../controllers/roleController");
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

// ✅ Only users with 'roles' permission can access
router.get("/matrix", authRequired, checkPermission('roles'), getPermissionMatrix);
router.get("/:role", authRequired, checkPermission('roles'), getRolePermissions);
router.put("/permission", authRequired, checkPermission('roles'), updateSinglePermission);
router.put("/permissions/bulk", authRequired, checkPermission('roles'), updateMultiplePermissions);

module.exports = router;
