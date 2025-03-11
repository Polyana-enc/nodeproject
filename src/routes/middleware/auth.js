require("dotenv").config();

const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");
const cookieParser = require("cookie-parser");

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key"; 

module.exports = (req, res, next) => {

    if (!req.cookies) {
        logger.error(`Cookie parser middleware not found.`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    const token = req.cookies.token;

    if (!token) {
        logger.error(`Not authorized`);
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        logger.error(`Invalid token: ${err}`);
        return res.status(403).json({ message: "Invalid token" });
    }
};
