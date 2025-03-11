const express = require("express");
const { get_user_by_id, user_register } = require("../controllers/user_controller.js");
const { healthcheck } = require("../controllers/index.js");

const router = express.Router();

router.get("/user", get_user_by_id);
router.post("/user", user_register);

module.exports = router;
