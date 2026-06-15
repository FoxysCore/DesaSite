import { GuildManager } from "./guild/GuildManager.js";
import { SettingsManager } from "./settings/SettingsManager.js"
import { Renderer } from "./ui/Renderer.js";
import { AuthManager } from "./auth/AuthManager.js";
import { FileManager } from "./files/fileManager.js";
export class Core {
    #renderer;
    #guildManager;
    #settingsManager;
    #fileMaqnager;

    constructor() {
        this.#settingsManager = new SettingsManager(this);
        this.#guildManager = new GuildManager(this);
        this.#renderer = new Renderer(this);
        this.#fileMaqnager = new FileManager(this);
        this.#guildManager.init();
    }

    getRenderer() {return this.#renderer;}
    getGuildManager() {return this.#guildManager;}
    getSettingsManager() {return this.#settingsManager;}
    getFileManager() {return this.#fileMaqnager;}
}