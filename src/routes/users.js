const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();
const {
  get_user_by_id,
  user_register,
  user_register_trans,
  user_login,
  user_logout,
  deleteUserById,
} = require("../controllers/user_controller.js");

router.get("/user", authMiddleware, get_user_by_id);
router.post("/user", user_register);
router.post("/user/trans", user_register_trans);
router.post("/user/login", user_login);
router.post("/user/logout", authMiddleware, user_logout);
router.delete("/user", authMiddleware, deleteUserById);

module.exports = router;
