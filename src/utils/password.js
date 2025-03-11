const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    const saltRounds = 10; 
    
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashedPassword);
            }
        });
    });
};

const comparePasswords = (plainPassword, storedHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMatch);
            }
        });
    });
};

module.exports = {
    hashPassword,
    comparePasswords
};
