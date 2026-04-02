import {GuildSettings} from "./GuildSettings.js";
import { ClientSettings } from "./ClientSettings.js";

export class SettingsManager {
    #core;

    #guildSettings;
    #clientSettings;

    constructor(core) {
        this.#core = core;
        this.#guildSettings = new GuildSettings(this);
        this.#clientSettings = new ClientSettings(this);
    }


    getCore() {return this.#core;}

    getGuildSettings() {return this.#guildSettings;}
    getClientSettings() {return this.#clientSettings;}
}