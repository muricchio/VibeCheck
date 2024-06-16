module.exports = class {
    id = null;
    name = null;
    floor = null;
    userID = null;

    constructor(data) {
        this.id = data.vib_id;
        this.name = data.vib_name;
        this.floor = data.vib_floor;
        this.userID = data.usr_id;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            floor: this.floor,
            userID: this.userID
        }
    }
};
