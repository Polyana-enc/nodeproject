const {
  get_user_by_id,
  create_user,
  get_user_by_email,
  get_user_password_by_id
} = require("../repository/user_repository");
const { hashPassword, comparePasswords } = require("../utils/password");
const { generateToken } = require("../utils/jwtUtil");
const logger = require("../utils/logger");

class UserExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserExistsError"; 
    }
}

async function get_user(id) {
  return get_user_by_id(id);
}

async function register_user(email, password) {
  const existing = await get_user_by_email(email);

  if (existing) {
        throw new UserExistsError(`User with email ${email} already exists`);
    }

  const created_date = new Date();
  const formatted_date = created_date.toISOString();
  const hash = await hashPassword(password);
  const user = await create_user(email, hash, formatted_date); 
  const token = generateToken(user.id);

  return { user: user, token };
}

module.exports = {
  register_user,
  get_user,
  UserExistsError
};
