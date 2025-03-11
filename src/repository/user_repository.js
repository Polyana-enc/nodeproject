const logger = require("../utils/logger");
const fs = require('fs').promises;

const MOCK_PATH = "../mock/users.json"; 

function get_user_by_id(id) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const users = JSON.parse(data);
        return objects.find(obj => obj.id === id) || null;
      } catch (err) {
            logger.error(`Error while getting a user: ${err}`);
        return null;
      }
}

async function create_user(email, password) {
    try {
        let users = [];
        try {
            const data = await fs.readFile(filePath, 'utf8');
            users = JSON.parse(data);
        } catch (err) {
            logger.error(`Error while creating a user: ${err}`);
            throw err; 
        }

        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const user = { id: newId, email, password };

        users.push(user);
        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');

        logger.info("User created:", user);
        return user;
    } catch (err) {
        logger.error('Error while saving user:', err);
        throw err;
    }
}

module.exports = {get_user_by_id, create_user};