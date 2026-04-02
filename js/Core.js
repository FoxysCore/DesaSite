import { GuildManager } from "./guild/GuildManager.js";
import { SettingsManager } from "./settings/SettingsManager.js"
import { Renderer } from "./ui/Renderer.js";
import { AuthManager } from "./auth/AuthManager.js";

export class Core {
    #renderer;
    #guildManager;
    #settingsManager;
    #authManager;

    constructor() {
        this.#settingsManager = new SettingsManager(this);
        this.#guildManager = new GuildManager(this);
        this.#renderer = new Renderer(this);
        this.#authManager = new AuthManager(this);
        this.#guildManager.init();
    }

    getRenderer() {return this.#renderer;}
    getGuildManager() {return this.#guildManager;}
    getSettingsManager() {return this.#settingsManager;}
    getAuthManager() {return this.#authManager;}
}