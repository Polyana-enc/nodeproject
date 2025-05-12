const logger = require("../utils/logger");
const DtoUser = require("../models/user_model.js");
const pool = require("../../db").default 
/**
 * Returns user by id and null otherwise
 * @param {number} id user id
 * @returns {object} user info except password
 */
async function get_user_by_id(id) {
  const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (res.rows.length === 0) return null;
  return new DtoUser(...Object.values(res.rows[0])).public_user();
}
/**
 * Returns user by email and null otherwise
 * @param {string} email user email
 * @returns {object} user info
 */
async function get_user_by_email(email) {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (res.rows.length === 0) return null;
  return new DtoUser(...Object.values(res.rows[0]));
}
/**
 * Creates new user by object
 * @param {string} email user email
 * @param {string} password hashed password
 * @param {string} created_at creation date
 * @returns {DtoUser} created user
 */
async function create_user(email, password, created_at) {
  const query = `
    INSERT INTO users (email, password, created_at, updated_at)
    VALUES ($1, $2, $3, $3)
    RETURNING *;
  `;
  const res = await pool.query(query, [email, password, created_at]);
  logger.info("User created:", email);
  return new DtoUser(...Object.values(res.rows[0]));
}
/**
 * Updates user (if exists) by id
 * @param {number} id user id
 * @returns {DtoUser|null} updated user
 */
async function update_user_by_id(id, data) {
  const query = `
    UPDATE users
    SET email = $1, password = $2, updated_at = $3
    WHERE id = $4
    RETURNING *;
  `;
  const res = await pool.query(query, [data.email, data.password, data.updated_at, id]);
  if (res.rows.length === 0) return null;
  return new DtoUser(...Object.values(res.rows[0]));
}
/**
 * Deletes user by id
 * @param {number} id user id
 * @returns {DtoUser|null} deleted user
 */
async function delete_user_by_id(id) {
  const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
  if (res.rows.length === 0) return null;
  return new DtoUser(...Object.values(res.rows[0]));
}

module.exports = {
  create_user,
  get_user_by_id,
  get_user_by_email,
  update_user_by_id,
  delete_user_by_id,
};
