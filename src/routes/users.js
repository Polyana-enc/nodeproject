const express = require("express");
const { get_user_by_id, user_register, user_login } = require("../controllers/user_controller.js");
const authMidleware = require("./middleware/auth.js")
const router = express.Router();

router.get("/user", authMidleware, get_user_by_id);
router.post("/user", user_register);
router.post("/user/auth", user_login)

module.exports = router;
