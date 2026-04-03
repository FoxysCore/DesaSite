import { GuildListRenderer } from "./GuildListRenderer.js";
import { ChannelsRenderer } from "./ChannelsRenderer.js";
import { RightMenuRenderer } from "./RightMenuRenderer.js";
import { MessagesRenderer } from "./MessagesRenderer.js";
import { CenterMenuRenderer } from "./CenterMenuRenderer.js"

export class Renderer {
    #core;
    #guildListRenderer;
    #channelsRenderer;
    #rightMenuRenderer;
    #messagesRenderer;
    #centerMenuRenderer;

    constructor(core) {
        this.#core = core;
        this.#guildListRenderer = new GuildListRenderer(this);
        this.#channelsRenderer = new ChannelsRenderer(this);
        this.#rightMenuRenderer = new RightMenuRenderer(this);
        this.#messagesRenderer = new MessagesRenderer(this);
        this.#centerMenuRenderer = new CenterMenuRenderer(this);
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