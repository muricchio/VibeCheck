const db = require('./DBConnection');
const Leaderboard = require('./models/Leaderboard');

function getLeaderboard() {
    return db.query('SELECT * FROM leaderboard').then(async ({results}) => {
        console.log(results);
        if (results) {
            let leaderboardArr = [];
            for (var key in results) {
                let leaderboard = new Leaderboard(results[key]);
                await db.query('SELECT usr_username FROM user WHERE usr_id = ?', [leaderboard.userID]).then(({results}) => {
                    if (!results) {
                        throw new Error('Couldn\'t get leaderboard');
                    }
                    leaderboard.username = results[0].usr_username;
                    leaderboardArr.push(leaderboard);
                    console.log(leaderboardArr);
                });
            }
            return leaderboardArr;
        }
        else {
            throw new Error('Couldn\'t get leaderboard');
        }
    })
}

function createLeaderboard(userID, score) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM leaderboard WHERE usr_id = ?', [userID]).then(({results}) => {
            console.log('results', results);
            if (results.length > 0) {  // already has an entry, so update
                console.log('test2');
                db.query('UPDATE leaderboard SET ldb_ranking = ? WHERE usr_id = ?', [score, userID]).then(results => {
                    if(!results) {
                        reject("Error adding to leaderboard");
                    }
                resolve("Successful leaderboard insert");
                });
            }
            else {
                db.query('INSERT INTO leaderboard (ldb_ranking, usr_id) VALUES (?, ?)', [score, userID]).then(results => {
                    console.log('test', results);
                    if(!results) {
                        reject("Error adding to leaderboard");
                    }
                });
                resolve("Successful leaderboard insert");
            }
        })
    });
}

module.exports = {
    getLeaderboard: getLeaderboard,
    createLeaderboard: createLeaderboard
}
