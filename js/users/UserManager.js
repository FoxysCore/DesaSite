import { User } from "./User.js";

export class UserManager {
    #guild;
    #users = new Map();

    #currentUserId = null;

    constructor(guild) {
        this.#guild = guild;
    }

    createUser(id, state) {
        const user = new User(id, state);
        this.#users.set(id, user);
        return user;
    }

    getUser(id) {
        return this.#users.get(id);
    }

    removeUser(id) {
        this.#users.delete(id);
    }

    getAllUsers() {
        return Array.from(this.#users.values());
    }

    setCurrentUser(id) {
        this.#currentUserId = id;
    }

    getCurrentUser() {
        console.log("Получение текущего пользователя:", this.#users.get(this.#currentUserId));
        return this.#users.get(this.#currentUserId);
    }

    removeRoleForEveryone(role) {
        for (const user of this.getAllUsers()) {
            user.removeRole(role);
        }
    }
}