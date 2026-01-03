// RoleManager.js

import { Role, RoleInfo } from '../roles/role.js';

export class RoleManager {
    #guild;
    #roles = new Map();
    #everyoneRole = new Role(-32768, new RoleInfo({}));

    constructor(guild) {
        this.#guild = guild;
    }

    getRole(id) {
        return this.#roles.get(id) ?? null;
    }

    createRole(id, priority, info) {
        const role = new Role(id, info);
        this.#roles.set(id, role);
        return role;
    }

    removeRole(role) {
        for (const user of this.#guild.userManager.getAllUsers()) {
            user.removeRole(role);
        }
        this.#roles.delete(role.getId());
    }
}