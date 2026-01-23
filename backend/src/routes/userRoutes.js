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

router.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

router.get("/", authRequired, listUsers);
router.get("/:id", authRequired, getUser);
router.post("/", authRequired, addUser);
router.put("/:id", authRequired, editUser);
router.delete("/:id", authRequired, removeUser);

module.exports = router;
