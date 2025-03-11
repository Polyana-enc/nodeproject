const { register_user } = require('../service/user_service');
const logger = require('../utils/logger');

async function get_user_by_id(req, res, next) {
    res.status(501).json({ message: "Not implemented" });
}

const user_register = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            logger.error("Invalid user data");
            return res.status(400).json({ message: 'All fields are required' });
        }

        const { new_user, token } = await register_user({ email, password });

        res.cookie('token', token, {
            httpOnly: true,     
            maxAge: 1 * 24 * 60 * 60 * 1000  
        });

        return res.status(200).json({
            message: 'User was created',
            user: { id: new_user.id, username: new_user.username, email: new_user.email }
        });
    } catch (err) {
        logger.error(`Error while registering user: ${err.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { user_register, get_user_by_id };
