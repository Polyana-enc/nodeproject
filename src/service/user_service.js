const {
  get_user_by_id,
  create_user,
  get_user_by_email,
  register_user_with_form,

} = require("../repository/user_repository");
const { hashPassword } = require("../utils/password");
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

async function register_user(data) {
  const existing = await get_user_by_email(data.email);

  if (existing) {
        throw new UserExistsError(`User with email ${data.email} already exists`);
    }
console.log(data)
  const created_date = new Date();
  const formatted_date = created_date.toISOString();
  const hash = await hashPassword(data.password);
  const user = await create_user(data.email, hash, formatted_date); 
  const token = generateToken(user.id);

  return { user: user, token };
}

async function register_user_trans(data) {
  const existing = await get_user_by_email(data.email);

  if (existing) {
        throw new UserExistsError(`User with email ${data.email} already exists`);
    }

  const created_date = new Date();
  const formatted_date = created_date.toISOString();
  const hash = await hashPassword(data.password);
  const user = await register_user_with_form({email: data.email, password: hash, created_at: formatted_date, name: data.name, age: data.age, gender: data.gender, city: data.city, bio: data.bio, phone: data.phone})
  const token = generateToken(user.user.id);

  return { user: user.user, token };
}

module.exports = {
  register_user,
  register_user_trans,
  get_user,
  UserExistsError
};
