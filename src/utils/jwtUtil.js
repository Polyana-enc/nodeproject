require("dotenv").config();

const logger = require("./logger")
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key"; 

function generateToken(payload, expiresIn = "6h") {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        logger.error(`Invalid token: ${e}`)
        return null;
    }
}

module.exports = { generateToken, verifyToken };
