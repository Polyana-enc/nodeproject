//KURMAX CODE ඞ
const Form = require("../models/form_model.js");
const sequelize = require("../../db.js");

/**
 * Creates new form by data
 * @param {object} data {user_id, name, age, gender, city, bio, email, phone}
 * @returns {Promise<Form>} created form
 */
async function create_form(data) {
  return await sequelize.transaction(async (t) => {
    const form = await Form.create(data, { transaction: t });
    return form;
  });
}
/**
 * Returns all forms from the database
 * @returns {Promise<Form[]>} Array of forms
 */
async function get_all_forms() {
  return await Form.findAll();
}
/**
 * Returns form by user id from the database
 * @param {number} user_id
 * @returns {Promise<Form|null>} found form or null if not found
 */
async function get_form_by_user_id(user_id) {
  return await Form.findOne({ where: { user_id } });
}
/**
 * Returns form by id from the database
 * @param {number} id
 * @returns {Promise<Form|null>} found form or null if not found
 */
async function get_form_by_id(id) {
  return await Form.findByPk(id);
}
/**
 * Updates a form by id in the database
 * @param {object} data {id, name, age, gender, city, bio, email, phone}
 * @returns {Promise<Form|null>} updated form or null if not found
 */
async function update_form_by_id(data) {
  return await sequelize.transaction(async (t) => {
    const form = await Form.findByPk(data.id, { transaction: t });
    if (!form) return null;
    await form.update(data, { transaction: t });
    return form;
  });
}
/**
 * Deletes a form by id from the database
 * @param {number} id
 * @returns {Promise<Form>} deleted form
 */
async function delete_form_by_id(id) {
  return await sequelize.transaction(async (t) => {
    const form = await Form.findByPk(id, { transaction: t });
    if (!form) {
      throw new Error(`Trying to delete non-existent form with id: ${id}`);
    }
    await form.destroy({ transaction: t });
    return form;
  });
}
/**
 * Deletes form (if it exists) by its user id
 * @param {number} user_id
 */
async function delete_form_by_user_id(user_id) {
  const form = await get_form_by_user_id(user_id);
  if (form) {
    await delete_form_by_id(form.id);
  }
}

module.exports = {
  create_form,
  get_form_by_user_id,
  get_form_by_id,
  delete_form_by_id,
  delete_form_by_user_id,
  update_form_by_id,
  get_all_forms,
};
