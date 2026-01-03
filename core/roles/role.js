// role.js

export class RoleInfo {
    constructor(data) {
        // pass — nothing to do
    }
}

export class Role {
    _id;
    info;

    constructor(id, info) {
        this._id = id;
        this.info = info;
    }

    getId() {
        return this._id;
    }
}