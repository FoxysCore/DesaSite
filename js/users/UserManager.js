import { User } from "./User.js";
import { UserState } from "./UserState.js"


class CurrentUser extends User {
    constructor(id, info) {
        super(id, UserState.ONLINE);
        this._info = info;
    }
}



export class UserManager {
    #guild;
    #users = new Map();
    #currentUser = null;
    

    constructor(guild) {
        this.#guild = guild;
    }

    createUser(id, state) {
        const user = new User(id, state);
        this.#users.set(id, user);
        return user;
    }

    getUser(id, safe = true) {
        let user = this.#users.get(id);
        if (!user && safe) {
            user = new User(id, UserState.OFFLINE);
            user.getInfo().update(
                "Неизвестный пользователь",
                "Пользователь был удалён",
                "./favicon.ico",
                "./favicon.ico"
            )
        }
        return user;
    }

    removeUser(id) {
        this.#users.delete(id);
    }

    getAllUsers() {
        return Array.from(this.#users.values());
    }

    setCurrentUser(id) {
        this.#currentUser = new CurrentUser(
            id, 
            this
                .#guild
                .getGuildManager()
                .getCore()
                .getSettingsManager()
                .getClientSettings()
                .getUserInfo()
        )
        this.#users.set(id, this.#currentUser);
        return this.#currentUser;
    }

    getCurrentUser() {
        return this.#currentUser;
    }

    removeRoleForEveryone(role) {
        for (const user of this.getAllUsers()) {
            user.removeRole(role);
        }
    }
}