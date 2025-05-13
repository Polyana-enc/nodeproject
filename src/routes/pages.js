const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  get_all_forms,
  get_form_by_user_id,
} = require("../repository/form_repository");
const {
  get_all_invites_by_sender_id,
  get_all_invites_by_receiver_id,
} = require("../repository/invite_repository");

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Головна сторінка
router.get("/", async (req, res)  => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const form = await get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  try {
    const rawForms = await get_all_forms();
    const forms = rawForms.filter(function (form) {
      return form.user_id != userId;
    });
    const invites = await get_all_invites_by_sender_id(userId);
    invites.push(...(await get_all_invites_by_receiver_id(userId)));
    res.render("index", { forms, invites, userId });
  } catch (err) {
    console.log(err);
    return res.redirect("/register");
  }
});

// My Page
router.get("/user", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const form = await get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  res.render("user");
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Form Create Page
router.get("/form/create", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  res.render("form_create", { form: null });
});

// Form Edit Page
router.get("/form/edit", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const form = await get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  try {
    res.render("form_edit", { form: form });
  } catch (err) {
    console.log(err);
    return res.redirect("/register");
  }
});

router.get("/sendedInvites", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const invites = await get_all_invites_by_sender_id(userId);
  const form = await get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  const forms = await get_all_forms();
  const formattedForms = forms.filter((form) =>
    invites.some((invite) => form.user_id === invite.receiver_id),
  );
  const data = [];
  invites.forEach((invite) => {
    formattedForms.forEach((form) => {
      if (form.user_id === invite.receiver_id) {
        if (invite.status === "accepted")
          return data.push({ invite: invite, form: form });
        else return data.push({ invite: invite, form: form.open_info() });
      }
    });
  });
  res.render("sendedInvites", { data });
});

router.get("/receivedInvites", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/login");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const form = await get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  const invites = await get_all_invites_by_receiver_id(userId);
  const forms = await get_all_forms();
  const formattedForms = forms.filter((form) =>
    invites.some((invite) => form.user_id === invite.sender_id),
  );
  const data = [];
  invites.forEach((invite) => {
    formattedForms.forEach((form) => {
      if (form.user_id === invite.sender_id) {
        data.push({ invite: invite, form: form });
      }
    });
  });

  res.render("receivedInvites", { data });
});

router.get("/search", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect("/register");
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const form = get_form_by_user_id(userId);
  if (!form) return res.redirect("/form/create");
  try {
    jwt.verify(token, SECRET_KEY);

    const keyword = req.query.keyword?.toLowerCase() || "";
    const allForms = await get_all_forms();

    const filtered = allForms.filter(
      (f) =>
        f.name.toLowerCase().includes(keyword) ||
        f.city.toLowerCase().includes(keyword),
    );
    const invites = await get_all_invites_by_sender_id(userId);
    invites.push(...(await get_all_invites_by_receiver_id(userId)));
    res.render("index", { forms: filtered , invites: invites, userId: userId});
  } catch (err) {
    return res.redirect("/register");
  }
});

module.exports = router;
