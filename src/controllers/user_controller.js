const { register_user, get_user, UserExistsError} = require("../service/user_service");
const logger = require("../utils/logger");

async function get_user_by_id(req, res, next) {
  try {
    const user_id = req.user_id;
    const user = get_user(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({user});
  }
  catch {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function user_login(req, res, next) { 
  res.status(501).json({ message: "Not implemented" });
}

const user_register = async (req, res, _next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error("Invalid user data");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { user, token } = await register_user(email,password);


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

module.exports = { user_register, get_user_by_id, user_login };
