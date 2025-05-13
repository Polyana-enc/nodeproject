const logger = require("../utils/logger");
const DtoUser = require("../models/user_model.js");
const DtoForm = require("../models/form_model.js");
const pool = require("../../db").default;
const withTransaction = require("../utils/withTransaction");

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
  return withTransaction(async (client) => {
    const query = `
    INSERT INTO users (email, password, created_at, updated_at)
    VALUES ($1, $2, $3, $3)
    RETURNING *;
  `;
    const res = await client.query(query, [email, password, created_at]);
    logger.info("User created:", email);
    return new DtoUser(...Object.values(res.rows[0]));
  });
}
/**
 * Updates user (if exists) by id
 * @param {number} id user id
 * @returns {DtoUser|null} updated user
 */
async function update_user_by_id(id, data) {
  return withTransaction(async (client) => {
    const query = `
    UPDATE users
    SET email = $1, password = $2, updated_at = $3
    WHERE id = $4
    RETURNING *;
  `;
    const res = await client.query(query, [
      data.email,
      data.password,
      data.updated_at,
      id,
    ]);
    if (res.rows.length === 0) return null;
    return new DtoUser(...Object.values(res.rows[0]));
  });
}
/**
 * Deletes user by id
 * @param {number} id user id
 * @returns {DtoUser|null} deleted user
 */
async function delete_user_by_id(id) {
  return withTransaction(async (client) => {
    const res = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rows.length === 0) return null;
    return new DtoUser(...Object.values(res.rows[0]));
  });
}

//🚧🚧🚧
/**
 * register user with form in 1 transaction
 * @param {object} data {email, password, created_at, name, age, gender, city, bio, phone}
 * @returns {{user: DtoUser, form: DtoForm}}
 */
async function register_user_with_form(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `
      INSERT INTO users (email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $3)
      RETURNING *;
      `,
      [data.email, data.password, data.created_at],
    );

    const user = new DtoUser(...Object.values(userRes.rows[0]));

    await client.query(
      `
      INSERT INTO forms (user_id, name, age, gender, city, bio, email, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `,
      [
        user.id,
        data.name,
        data.age,
        data.gender,
        data.city,
        data.bio,
        data.email,
        data.phone,
      ],
    );

    // const form = new DtoForm(...Object.values(formRes.rows[0]));

    await client.query("COMMIT");

    return { user };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
}
//🚧🚧🚧

module.exports = {
  create_user,
  get_user_by_id,
  get_user_by_email,
  update_user_by_id,
  delete_user_by_id,

  register_user_with_form,
};
