const {
  get_user_by_email,
  get_user_password_by_id,
  delete_user_by_id,
} = require("../repository/user_repository");
const {
  register_user,
  get_user,
  UserExistsError,
} = require("../service/user_service");
const { generateToken } = require("../utils/jwtUtil");
const logger = require("../utils/logger");
const { comparePasswords } = require("../utils/password");

async function get_user_by_id(req, res, next) {
  try {
    const user_id = req.user_id;
    const user = get_user(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function user_login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await get_user_by_email(email);
    if (!user)
      return res
        .status(400)
        .json({ message: `User doesn't exist, email:${email}` });
    if (await comparePasswords(password, get_user_password_by_id(user.id))) {
      const token = generateToken(user.id);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ user });
    }
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: "Login error" });
  }
}

function user_logout(req, res, next) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({ message: "Logout error" });
  }
}

const user_register = async (req, res, _next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error("Invalid user data");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { user, token } = await register_user(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "User was created",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    logger.error("User registration failed:", err);

    if (err instanceof UserExistsError) {
      return res.status(409).json({ message: "User already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

async function deleteUserById(req, res, next) {
  try {
    const user_id = req.user_id;
    const user = await delete_user_by_id(user_id);
    res.status(200).json({ user: user });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  user_register,
  get_user_by_id,
  user_login,
  user_logout,
  deleteUserById,
};
