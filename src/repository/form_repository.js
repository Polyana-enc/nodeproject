//KURMAX CODE ඞ
const DtoForm = require("../models/form_model.js");
const pool = require("../../db.js").default;
/**
 * Creates new form by data
 * @param {object} data {user_id, name, age, gender, city, bio, email, phone,}
 * @returns {DtoForm} created form
 */
async function create_form(data) {
  const query = `
    INSERT INTO forms (user_id, name, age, gender, city, bio, email, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const res = await pool.query(query, [
    data.user_id,
    data.name,
    data.age,
    data.gender,
    data.city,
    data.bio,
    data.email,
    data.phone,
  ]);
  return new DtoForm(...Object.values(res.rows[0]));
}
/**
 * Returns all forms from the database
 * @returns {DtoForm[]} Array of forms
 */
async function get_all_forms() {
  const res = await pool.query("SELECT * FROM forms");
  return res.rows.map((row) => new DtoForm(...Object.values(row)));
}
/**
 * Returns form by user id from the database
 * @param {number} user_id form user id
 * @returns {DtoForm|null} found form or null if not found
 */
async function get_form_by_user_id(user_id) {
  const res = await pool.query("SELECT * FROM forms WHERE user_id = $1", [
    user_id,
  ]);
  if (res.rows.length === 0) return null;
  return new DtoForm(...Object.values(res.rows[0]));
}
/**
 * Returns form by id from the database
 * @param {number} id form id
 * @returns {DtoForm|null} found form or null if not found
 */
async function get_form_by_id(id) {
  const res = await pool.query("SELECT * FROM forms WHERE id = $1", [id]);
  if (res.rows.length === 0) return null;
  return new DtoForm(...Object.values(res.rows[0]));
}
/**
 * Updates a form by id in the database
 * @param {object} data {id, name, age, gender, city, bio, email, phone}
 * @returns {DtoForm|null} updated form or null if not found
 */
async function update_form_by_id(data) {
  const query = `
    UPDATE forms SET
      name = $1, age = $2, gender = $3, city = $4, bio = $5, email = $6, phone = $7
    WHERE id = $8
    RETURNING *;
  `;
  const res = await pool.query(query, [
    data.name,
    data.age,
    data.gender,
    data.city,
    data.bio,
    data.email,
    data.phone,
    data.id,
  ]);
  if (res.rows.length === 0) return null;
  return new DtoForm(...Object.values(res.rows[0]));
}
/**
 * Deletes a form by id from the database
 * @param {number} id form id
 */
async function delete_form_by_id(id) {
  const res = await pool.query("DELETE FROM forms WHERE id = $1 RETURNING *", [
    id,
  ]);
  if (res.rows.length === 0) {
    throw new Error(`Trying to delete non-existent form with id: ${id}`);
  }
  return new DtoForm(...Object.values(res.rows[0]));
}
/**
 * Deletes form (if it exists) by its user id
 * @param {number} user_id form user id
 */
async function delete_form_by_user_id(user_id) {
  const form = get_form_by_user_id(user_id);
  await delete_form_by_id(form.id);
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
