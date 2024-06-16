module.exports = class {
    id = null;
    score = null;
    userID = null;

    constructor(data) {
        this.id = data.ldb_id;
        this.score = data.ldb_ranking;
        this.userID = data.usr_id;
    }

    toJSON() {
        return {
            id: this.id,
            score: this.score,
            userID: this.userID
        }
    }
};
