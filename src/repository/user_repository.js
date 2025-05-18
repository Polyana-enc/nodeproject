const User = require("../models/user_model.js");
const Form = require("../models/form_model.js");
const logger = require("../utils/logger.js");
const sequelize = require("../../db.js");

/**
 * Returns user by id and null otherwise
 * @param {number} id user id
 * @returns {Promise<User>} user info except password
 */
async function get_user_by_id(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  const { password, ...publicUser } = user.get();
  return publicUser;
}
/**
 * Returns user by email and null otherwise
 * @param {string} email user email
 * @returns {Promise<User>} user info
 */
async function get_user_by_email(email) {
  return await User.findOne({ where: { email } });
}
/**
 * Creates new user by object
 * @param {string} email user email
 * @param {string} password hashed password
 * @param {string} created_at creation date
 * @returns {User} created user
 */
async function create_user(email, password, created_at) {
  const user = await sequelize.transaction(async (t) => {
    const newUser = await User.create(
      {
        email,
        password,
        created_at,
        updated_at: created_at,
      },
      { transaction: t },
    );

    logger.info("User created:", email);
    return newUser;
  });
  return user;
}
/**
 * Updates user (if exists) by id
 * @param {number} id user id
 * @returns {User|null} updated user
 */
async function update_user_by_id(id, data) {
  return await sequelize.transaction(async (t) => {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) return null;

    await user.update(
      {
        email: data.email,
        password: data.password,
        updated_at: data.updated_at,
      },
      { transaction: t },
    );

    return user;
  });
}
/**
 * Deletes user by id
 * @param {number} id user id
 * @returns {User|null} deleted user
 */
async function delete_user_by_id(id) {
  return await sequelize.transaction(async (t) => {
    const user = await User.findByPk(id, { transaction: t });
    if (!user) return null;

    await user.destroy({ transaction: t });
    return user;
  });
}

//🚧🚧🚧
/**
 * register user with form in 1 transaction
 * @param {object} data {email, password, created_at, name, age, gender, city, bio, phone}
 * @returns {{user: User, form: Form}}
 */
async function register_user_with_form(data) {
  return await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        email: data.email,
        password: data.password,
        created_at: data.created_at,
        updated_at: data.created_at,
      },
      { transaction: t },
    );

    await Form.create(
      {
        user_id: user.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        city: data.city,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
      },
      { transaction: t },
    );

    return { user };
  });
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
