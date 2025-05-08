const logger = require("../utils/logger");
const fs = require("fs").promises;
const DtoUser = require("../models/user_model.js");
const MOCK_PATH = "../nodeproject/src/mock/users.json";

let users = [];
/**
 * Deserializes all users in JSON
 */
async function deserialize_all_users() {
  const data = await fs.readFile(MOCK_PATH, "utf8");
  const array = JSON.parse(data);
  users = array.map((el) => {
    return new DtoUser(
      el.id,
      el.email,
      el.password,
      el.created_at,
      el.updated_at,
    );
  });
}
/**
 * Serializes all users in JSON
 */
async function serialize_all_users() {
  await fs.writeFile(MOCK_PATH, JSON.stringify(users, null, 2), "utf8");
}
/**
 * Returns user password by id and null otherwise
 * @param {number} id user id
 * @returns {string} hashed password
 */
function get_user_password_by_id(id) {
  const user = users.find((el) => el.id === id);
  if (!user) return null;
  return user.password;
}
/**
 * Returns user by id and null otherwise
 * @param {number} id user id
 * @returns {object} user info except password
 */
function get_user_by_id(id) {
  const user = users.find((el) => el.id === id);
  if (!user) return null;
  return user.public_user();
}
/**
 * Returns user by email and null otherwise
 * @param {string} email user email
 * @returns {object} user info except password
 */
async function get_user_by_email(email) {
  const user = users.find((user) => user.email === email);
  if (!user) return null;
  return user.public_user();
}
/**
 * Creates new user by object
 * {email, password, created_at}
 * @param {string} email user email
 * @param {string} password hashed password
 * @param {string} created_at creation date
 * @returns {DtoUser} created user
 */
async function create_user(email, password, created_at) {
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const user = new DtoUser(newId, email, password, created_at, created_at);
  users.push(user);
  await serialize_all_users();
  logger.info("User created:", user.email);
  return user;
}
/**
 * Updates user (if it exists) by id
 * @param {number} id user id
 * @returns {DtoUser} updated user
 */
function update_user_by_id(id){
  const user = get_user_by_id(id);
  if(!user) return null
  user.email = data.email;
  user.password = data.password;
  user.updated_at = data.updated_at
  serialize_all_users()
  return user
}

function delete_user_by_id(id){
  const user = get_user_by_id(id);
  if(!user) return null
  users = users.filter(function(user){return user.id != id})
  serialize_all_users()
  return user
}

module.exports = {
  serialize_all_users,
  deserialize_all_users,
  create_user,
  get_user_by_id,
  get_user_by_email,
  get_user_password_by_id,
  update_user_by_id,
  delete_user_by_id,
};
