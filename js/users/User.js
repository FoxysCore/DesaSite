import { UserInfo } from "./UserInfo.js";

export class User {
    _state;
    _id;
    _info = new UserInfo();
    _roles = new Set();
    
    constructor(id, state) {
        this._id = id;
        this._state = state;
    }

    getId() {
        return this._id;
    }

    getInfo() {
        return this._info;
    }

    getState() {
        return this._state;
    }

    setState(newState) {
        this._state = newState;
    }

    getRoles() {return this._roles;}

    
    addRole(role) {
        this._roles.add(role)
    }

    removeRole(role) {
        this._roles.delete(role);
    }
}