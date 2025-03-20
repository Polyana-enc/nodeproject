const logger = require("../utils/logger");
const fs = require("fs").promises;
const fs_sync = require("fs");
const DtoUser = require("../models/user_model.js");
const MOCK_PATH = "../nodeproject/src/mock/users.json";

function get_user_by_id(id) {
  try {
    const data = fs_sync.readFileSync(MOCK_PATH, "utf8");
    const users = JSON.parse(data);

    const user = users.find((obj) => obj.id === id) || null;
    if (!user) return null;
    const userDTO = new DtoUser(
      user.id,
      user.email,
      user.password,
      user.created_at,
      user.updated_at
    );

    return userDTO.public_user();
  } catch (err) {
    logger.error(`Error while getting a user: ${err}`);
    throw err;
  }
}

function get_user_password_by_id(id) {
  try {
    const data = fs_sync.readFileSync(MOCK_PATH, "utf8");
    const users = JSON.parse(data);

    const user = users.find((obj) => obj.id === id) || null;
    if (!user) return null;

    return user.password;
  } catch (err) {
    logger.error(`Error while getting a user: ${err}`);
    throw err;
  }
}
async function get_user_by_email(email) {
  try {
    const data = await fs.readFile(MOCK_PATH, "utf8");
    const users = JSON.parse(data);
    return users.find((user) => user.email === email) || null;
  } catch (err) {
    logger.error(`Error while reading or parsing users file: ${err}`);
    throw err;
  }
}

async function create_user(email, password, name, created_at) {
  try {
    let users = [];

    try {
      const data = await fs.readFile(MOCK_PATH, "utf8");
      users = JSON.parse(data);
    } catch (err) {
      logger.error(`Error while creating a user: ${err}`);
      throw err;
    }

    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = {
      id: newId,
      email,
      password,
      name,
      created_at,
      updated_at: created_at,
    };

    users.push(user);
    await fs.writeFile(MOCK_PATH, JSON.stringify(users, null, 2), "utf8");

    logger.info("User created:", user.email);
    return user;
  } catch (err) {
    logger.error("Error while saving user:", err);
    throw err;
  }
}

module.exports = { get_user_by_id, create_user, get_user_by_email,get_user_password_by_id };
