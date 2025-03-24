const logger = require("../utils/logger");
const fs = require("fs").promises;
const fs_sync = require("fs");
const DtoUser = require("../models/user_model.js");
const MOCK_PATH = "../nodeproject/src/mock/users.json";

let users = [];
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

async function serialize_all_users() {
  await fs.writeFile(MOCK_PATH, JSON.stringify(users, null, 2), "utf8");
}

function get_user_by_id(id) {
  try {
    const user = users.find((el) => el.id === id) || null;

    if (!user) return null;

    return user.public_user();
  } catch (err) {
    logger.error(`Error while getting a user: ${err}`);
    throw err;
  }
}

function get_user_password_by_id(id) {
  try {
    const user = users.find((el) => el.id === id) || null;
    if (!user) return null;

    return user.password;
  } catch (err) {
    logger.error(`Error while getting a user: ${err}`);
    throw err;
  }
}
async function get_user_by_email(email) {
  try {
    const user = users.find((user) => user.email === email);
    if (!user) return null;
    
    return user.public_user();
  } catch (err) {
    logger.error(`Error while reading or parsing users file: ${err}`);
    throw err;
  }
}

async function create_user(email, password, created_at) {
  try {
    
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = new DtoUser(newId, email, password, created_at, created_at);

    users.push(user);
    await serialize_all_users();

    logger.info("User created:", user.email);
    return user;
  } catch (err) {
    logger.error("Error while saving user:", err);
    throw err;
  }
}

module.exports = {
  serialize_all_users,
  deserialize_all_users,
  get_user_by_id,
  create_user,
  get_user_by_email,
  get_user_password_by_id,
};
