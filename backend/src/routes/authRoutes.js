const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getMe,
} = require("../controllers/authController");
const { authRequired } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.get("/me", authRequired, getMe);

module.exports = router;
