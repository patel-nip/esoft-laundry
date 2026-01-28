const express = require("express");
const router = express.Router();
const {
    listUsers,
    getUser,
    addUser,
    editUser,
    removeUser
} = require("../controllers/userController");
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

// ✅ All routes protected with users permission
router.get("/", authRequired, checkPermission('users'), listUsers);
router.get("/:id", authRequired, checkPermission('users'), getUser);
router.post("/", authRequired, checkPermission('users'), addUser);
router.put("/:id", authRequired, checkPermission('users'), editUser);
router.delete("/:id", authRequired, checkPermission('users'), removeUser);

module.exports = router;
