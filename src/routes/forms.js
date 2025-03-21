const express = require("express");
const {
  create_form,
  get_form_by_user_id,
} = require("../controllers/form_controller.js");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();

router.post("/form", authMiddleware, create_form);
router.get("/form", authMiddleware, get_form_by_user_id);

module.exports = router;
