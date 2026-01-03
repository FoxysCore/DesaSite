import { Guild, HomeGuild } from "./guild.js";
import { getProfileSettings, getGuildListSettings } from "./settings/settingsContent.js";
import { auth } from "./auth/auth.js";

export class Core {
    #guilds = {};
    #selectedGuild = null;
    #homeGuild = null;
    constructor() {
        this.#homeGuild = new HomeGuild(this);
        this.#guilds[this.#homeGuild.getId()] = this.#homeGuild;
        this.#homeGuild.render();

        this.#homeGuild.channelManager.createChannel('SCOPE', "root", 'Профиль', getProfileSettings());
        this.#homeGuild.channelManager.createChannel('SCOPE', "root", 'Серверы', getGuildListSettings());
        this.#homeGuild.channelManager.createChannel('CATEGORY', "root", 'Аудио и видео');
        this.#homeGuild.channelManager.createChannel('SCOPE', "Аудио и видео", 'Микрофон', document.createElement('div'));
        this.#homeGuild.channelManager.createChannel('SCOPE', "Аудио и видео", 'Динамики', document.createElement('div'));
        this.#homeGuild.channelManager.createChannel('SCOPE', "Аудио и видео", 'Камера', document.createElement('div'));
        this.#homeGuild.channelManager.createChannel('SCOPE', "Аудио и видео", 'Демонстрация', document.createElement('div'));
        this.#homeGuild.channelManager.createChannel('SCOPE', "Аудио и видео", 'Рендеринг', document.createElement('div'));



        this.selectGuild(this.#homeGuild.getId());
    }

    addGuild(ip, port) {
        const guild = new Guild(this, ip, port);
        this.#guilds[guild.getId()] = guild;
        guild.connection.connect();
        return guild;
    }


    getHomeGuild() {
        return this.#homeGuild;
    }


    getGuildById(id) {
        return this.#guilds[id];
    }


    removeGuildById(id) {
        if (!id || id === this.#homeGuild.getId()) return;
        const guild = this.#guilds[id];
        if (guild) {
            if (this.getSelectedGuild() === guild) {
                this.selectGuild(this.#homeGuild.getId());
            }
            guild.unrender();
            guild.connection.disconnect();
            delete this.guilds[id];
        }
    }


    getSelectedGuild() {
        return this.#selectedGuild;
    }


    selectGuild(id) {
        console.log(`Selecting guild: ${id}`);
        const guild = this.getGuildById(id);
        console.log(guild);


        const width = 600, height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        if (guild) {
            auth(guild);
            if (this.#selectedGuild) {
                this.#selectedGuild.unselect();
            }
            guild.select();
            this.#selectedGuild = guild;
        }
    }
}