const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();
const {
  get_user_by_id,
  user_register,
  user_login,
  user_logout,
} = require("../controllers/user_controller.js");

router.get("/user", authMiddleware, get_user_by_id);
router.post("/user", user_register);
router.post("/user/login", user_login);
router.post("/user/logout", authMiddleware, user_logout);

module.exports = router;
