const {
  get_user_by_email,
  delete_user_by_id,

  register_user_with_form,
} = require("../repository/user_repository");
const {
  register_user,
  get_user,
  UserExistsError,
  register_user_trans,
} = require("../service/user_service");
const { generateToken } = require("../utils/jwtUtil");
const logger = require("../utils/logger");
const { comparePasswords } = require("../utils/password");

const TOKEN_MAX_AGE = 1 * 24 * 60 * 60 * 1000; 
async function get_user_by_id(req, res, next) {
  try {
    const user_id = req.user_id;
    const user = await get_user(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
      message: "User retrieved successfully",
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

async function user_login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn("Login failed: missing credentials");
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await get_user_by_email(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with email ${email} not found`,
      });
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password",
      });
    }

    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: TOKEN_MAX_AGE,
    });

    return res.status(200).json({
      success: true,
      data: { user },
      message: "Login successful",
    });
  } catch (err) {
    logger.error("Login error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

function user_logout(req, res, next) {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    logger.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

const user_register = async (req, res, _next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Registration failed: missing email or password");
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    const { user, token } = await register_user(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: TOKEN_MAX_AGE,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: { id: user.id, email: user.email },
      },
    });
  } catch (err) {
    logger.error("User registration failed:", err);

    if (err instanceof UserExistsError) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

async function deleteUserById(req, res, next) {
  try {
    const user_id = req.user_id;
    const user = await delete_user_by_id(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
      message: "User deleted successfully",
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}


const user_register_trans = async (req, res, _next) => {
  const data = req.body;

  if (!data.email || !data.password) {
    logger.warn("Registration failed: missing email or password");
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    const { user, token } = await register_user_trans(data);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: TOKEN_MAX_AGE,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: { id: user.id, email: user.email },
      },
    });
  } catch (err) {
    logger.error("User registration failed:", err);

    if (err instanceof UserExistsError) {
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


module.exports = {
  user_register,
  user_register_trans,
  get_user_by_id,
  user_login,
  user_logout,
  deleteUserById,
};
