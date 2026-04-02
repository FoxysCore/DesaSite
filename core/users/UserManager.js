// UserManager.js

import { User, UserInfo, UserState, UnknownUser } from './User.js';
import { Role } from '../roles/role.js';

export class UserManager {
    #guild;
    #unknownUser = new UnknownUser();
    #users = new Map();
    #currentUser = null;

    constructor(guild) {
        this.#guild = guild;
    }

    getUser(id) {
        return this.#users.get(id) ?? null;
    }

    getUnknownUser() {
        return this.#unknownUser;
    }

    getAllUsers() {
        return Array.from(this.#users.values());
    }

    createUser(state, id, roles, info) {
        const user = new User(state, id, info);
        this.#users.set(id, user);
        for (const role of roles) {
            user.addRole(role);
        }
        if (id === this.#guild.nick) {
            this.#currentUser = user;
        }
        return user;
    }

    removeUser(id) {
        const user = this.#users.get(id);
        if (user !== undefined) {
            this.#users.delete(id);
            return user;
        }
        return null;
    }

    getCurrentUser() {
        return this.#currentUser;
    }
}