const {
  create_form,
  get_form_by_user_id,
} = require("../repository/form_repository");
const logger = require("../utils/logger");

async function get_form_by_user(user_id) {
  return get_form_by_user_id(1, (err, userData) => {
    if (err) {
        console.error("Error fetching user data:", err);
    } else {
        console.log("User Data:", userData);
    }
});
}

module.exports = {
    get_form_by_user,
}