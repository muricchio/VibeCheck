const db = require('./DBConnection');
const Vibe = require('./models/Vibe');

function createVibe(userID, vibes) {
    return new Promise((resolve, reject) => {
        let floor = 0;
        for (let i = 0; i < 5; i++) {
            db.query('INSERT INTO vibe (vib_name, vib_floor, usr_id) VALUES (?, ?, ?)', [vibes[i], floor, userID]).then(results => {
                if(!results) {
                    reject("Error adding vibes");
                }
            });
            floor += 20;
        }
        resolve("Successful vibe inserts");
    });
}

function deleteVibe(vibeName, userID) {
    return new Promise((resolve, reject) => {
        return db.query('DELETE FROM vibe WHERE vib_name = ? AND usr_id = ?', [vibeName, userID]).then(results => {
            if (results) {
                resolve('Successfully Deleted vibe');
            }
            else {
                reject('Couldn\'t delete vibe');
            }
        });
    });
}

function getVibes(userID) {
    return new Promise((resolve, reject) => {
        return db.query('SELECT * FROM vibe WHERE usr_id = ?', [userID]).then(({ results }) => {
            if (results) {
                let vibeArr = [];
                for (var key in results) {
                    let vibe = new Vibe(results[key]);
                    vibeArr.push(vibe);
                }
                resolve(vibeArr);
            }
            else {
                reject('Couldn\'t get vibes for user');
            }
        });
    });
}

module.exports = {
    createVibe: createVibe,
    deleteVibe: deleteVibe,
    getVibes: getVibes,
}
