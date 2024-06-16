const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

function getUserByCredentials(username, password) {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({ results }) => {
        const user = new User(results[0]);
        if (user) {
            return user.validatePassword(password);
        }
        else {
            throw new Error("No such user");
        }
    });
}

function createUser(username, password) {
    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(({ results }) => {
            if(results.length > 0) {
                reject("Error: user with username " + username + " already exists");
            }
        });
        const salt = crypto.randomBytes(16).toString('hex');
        let passwordHash = null;

        return crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject("Error: " + err);
            }

            passwordHash = derivedKey.toString('hex');

            return db.query('INSERT INTO user (usr_username, usr_salt, usr_password) VALUES (?, ?, ?)', [username, salt, passwordHash]).then(() => {
                return db.query('SELECT * FROM user WHERE usr_username = ?', [username]).then(({ results }) => {

                    const user = new User(results[0]);
                    if (user) {
                        resolve(user);
                    }
                    else {
                        reject('Error creating user');
                    }
                });
            });
        });
    });

}

function getUser(username) {
    return new Promise((resolve, reject) => {
        return db.query('SELECT * FROM user WHERE usr_username = ?', [username]).then(({ results }) => {
            const user = new User(results[0]);
            if (user) {
                resolve(user);
            }
            else {
                reject('Could not get user');
            }
        });
    });
}


module.exports = {
    getUserByCredentials: getUserByCredentials,
    createUser: createUser,
    getUser: getUser,
};
