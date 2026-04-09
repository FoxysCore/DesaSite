import { GuildListRenderer } from "./GuildListRenderer.js";
import { ChannelsRenderer } from "./ChannelsRenderer.js";
import { RightMenuRenderer } from "./RightMenuRenderer.js";
import { MessagesRenderer } from "./MessagesRenderer.js";
import { CenterMenuRenderer } from "./CenterMenuRenderer.js"
import { SettingsRenderer } from "./SettingsRenderer.js";

export class Renderer {
    #core;
    #guildListRenderer;
    #channelsRenderer;
    #rightMenuRenderer;
    #messagesRenderer;
    #centerMenuRenderer;
    #settingsRenderer;

    constructor(core) {
        this.#core = core;
        this.#guildListRenderer = new GuildListRenderer(this);
        this.#channelsRenderer = new ChannelsRenderer(this);
        this.#rightMenuRenderer = new RightMenuRenderer(this);
        this.#messagesRenderer = new MessagesRenderer(this);
        this.#centerMenuRenderer = new CenterMenuRenderer(this);
        this.#settingsRenderer = new SettingsRenderer(this);

        document.body.addEventListener("click", (event) => {
            if (!event.target.closest("#rightMenu")) {this.#rightMenuRenderer.close();}
            if (!event.target.closest("#centerMenu")) {this.#centerMenuRenderer.close();}
            if (!event.target.closest("#settingsMenu")) {document.getElementById("settingsMenu").classList.remove("open")}
            if (!event.target.closest("#channelsPanel") && !event.target.closest("#serversPanel")) {
                if (window.innerWidth <= 768) {
                    document.getElementById("serversPanel").classList.add("collapsed");
                    document.getElementById("channelsPanel").classList.add("collapsed");
                }
            }
        });
    }

    getCore() {
        return this.#core;
    }

    getGuildListRenderer() {
        return this.#guildListRenderer;
    }

    getChannelsRenderer() {
        return this.#channelsRenderer;
    }

    getRightMenuRenderer() {
        return this.#rightMenuRenderer;
    }

    getMessagesRenderer() {
        return this.#messagesRenderer;
    }

    getCenterMenuRenderer() {
        return this.#centerMenuRenderer;
    }
}