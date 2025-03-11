const { get_user_by_id, create_user } = require("../repository/user_repository");
const { hashPassword, comparePasswords } = require("../utils/password");
const {generateToken} = require("../utils/jwtUtil");

function get_user(id) {

}

async function register_user(email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error(`User ${emal} already exists`);
    }

    let hach = await hashPassword(password);
    let user = await create_user(email, password);
    let token = generateToken(user.id);

    return {user: new_user, token};
}

module.exports = {
    register_user
};
