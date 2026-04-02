import { RootCategory } from "../channels/RootCategory.js";
import { RoleManager } from "../roles/RoleManager.js";
import { UserManager } from "../users/UserManager.js";
import { Connection } from "../web/Connection.js";
import { GuildInfo } from "./GuildInfo.js";
import { PackageRouter } from "../web/packages/PackageRouter.js";
import { AuthManager } from "../auth/AuthManager.js";

export class Guild {
    #guildManager;

    #id;

    #guildInfo = new GuildInfo();
    #rootCategory;
    #userManager;
    #roleManager;

    #connection;
    #packageRouter;

    #authManager;

    constructor(guildManager, id, address) {
        this.#guildManager = guildManager;
        this.#id = id;
        this.#rootCategory = new RootCategory(this);
        this.#roleManager = new RoleManager(this);
        this.#userManager = new UserManager(this);

        this.#packageRouter = new PackageRouter(this);
        this.#connection = new Connection(this, address);

        this.#authManager = new AuthManager(this);
    }

    getId() {return this.#id;}
    
    getGuildManager() {return this.#guildManager;}

    getInfo() {return this.#guildInfo;}

    getRootCategory() {return this.#rootCategory;}
    getUserManager() {return this.#userManager;}
    getRoleManager() {return this.#roleManager;}
    
    getPackageRouter() {return this.#packageRouter;}
    getConnection() {return this.#connection;}

    getAuthManager() {return this.#authManager;}

}