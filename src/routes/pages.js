const express = require("express");
const router = express.Router();

// To test your pages just run project with nodemon ("npm run dev" in terminal) and open: http://localhost:3000
// then to navigate to other pages just add /*page name* (ex.: http://localhost:3000/user), simple is that!😁😀😎

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/user", (req, res) => {
  res.render("user");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/form/edit", (req, res) => {
  res.render("form_edit");
});
module.exports = router;
