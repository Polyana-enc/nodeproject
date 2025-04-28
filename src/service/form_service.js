const { get_form_by_id, get_form_by_user_id } = require("../repository/form_repository");

/**
 *
 * @param {number} id 
 * @param {'public' | 'private'} type 
 * @returns
 */
async function getFormById(id, type) {
  
  const form = get_form_by_id(Number(id));
  if(!form) throw new Error(`Form not found by id: ${id}`)
  if (type === "public") {
    return form.open_info();
  } else if (type === "private") {
    return form.private_info();
  } else throw new Error(`Invalid info type: ${type}`);
}

async function getFormByUserId(user_id, type) {
  const form = get_form_by_user_id(user_id);
  if (type === "public") {
    return form.open_info();
  } else if (type === "private") {
    return form.private_info();
  } else throw new Error(`Invalid info type: ${type}`);
}

module.exports = {
  getFormById,
  getFormByUserId
};
