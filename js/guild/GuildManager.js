import { Guild } from "./Guild.js";
import { HomeGuild } from "./HomeGuild.js";

export class GuildManager {

    #guilds = new Map();
    #core;
    #homeGuild;

    constructor(core) {
        this.#core = core;
        this.#homeGuild = new HomeGuild();
        this.#guilds.set(this.#homeGuild.getId(), this.#homeGuild); 
    }

    createGuild(address) {
        const guild = new Guild(this, this.#getFreeId(), address);
        this.#guilds.set(guild.getId(), guild);
        this.#core.getRenderer().getGuildListRenderer().createGuild(guild);
        this.#core.getSettingsManager().getGuildSettings().createGuild(guild);
        return guild;
    }

    getHomeGuild() {
        return this.#homeGuild;
    }

    removeGuild(id) {
        const guild = this.#guilds.get(id);
        if (!guild) {return;}
        this.#core.getRenderer().getGuildListRenderer().removeGuild(guild);
        guild.getConnection().disconnect();
        this.#guilds.delete(id);
    }

    getGuild(id) {
        return this.#guilds.get(id);
    }

    getGuilds() {
        return this.#guilds.values();
    }

    getCore() {return this.#core;}


    init() {
        const guilsInfos = this.#core.getSettingsManager().getGuildSettings().getGuildInfos();
        for (const guildInfo of guilsInfos) {
            const guild = new Guild(this, guildInfo.id, guildInfo.address);
            this.#guilds.set(guild.getId(), guild);
            this.#core.getRenderer().getGuildListRenderer().createGuild(guild);
            try {guild.getConnection().connect(false);}
            catch (e) {guild.getConnection().connect(true);}
        }
    }


    #getFreeId() {
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (!this.#guilds.has(i)) {return i;}
        }
    }
}