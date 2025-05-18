const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const router = express.Router();
const {
  getFormById,
  createForm,
  updateFormById,
  deleteFormById,
  deleteFormByUserId,
  getFormByUserId,
  getInfoById,
  getInfoByUserId,
  getPageOfForms,
  getFilteredForms,
} = require("../controllers/form_controller.js");

router.post("/form", authMiddleware, createForm);

// GET http://example.com/form
// Authorization: token.user_id.1
router.get("/form", authMiddleware, getFormByUserId);
router.get("/form/:form_id", getFormById);
// GET http://example.com/form/user/2/public
// Authorization: token.user_id.1
router.get("/form/user/:user_id/:type", getInfoByUserId);

// GET http://example.com/form/3/private
router.get("/form/:form_id/:type", getInfoById);

router.get("/form/page/:offset/:limit", getPageOfForms);
router.get("/form/filter/:field/:value", getFilteredForms); // allowed fields: "gender", "city", "age"
// DELETE http://example.com/form
// Authorization: token.user_id.1
router.delete("/form", authMiddleware, deleteFormByUserId);
router.delete("/form/:form_id", deleteFormById);
router.put("/form", updateFormById);

module.exports = router;
