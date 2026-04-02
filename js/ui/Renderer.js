import { GuildListRenderer } from "./GuildListRenderer.js";
import { ChannelsRenderer } from "./ChannelsRenderer.js";
import { RightMenuRenderer } from "./RightMenuRenderer.js";
import { MessagesRenderer } from "./MessagesRenderer.js";
import { AuthMenuRenderer } from "./AuthMenuRenderer.js";

export class Renderer {
    #core;
    #guildListRenderer;
    #channelsRenderer;
    #rightMenuRenderer;
    #messagesRenderer;
    #authMenuRenderer;

    constructor(core) {
        this.#core = core;
        this.#guildListRenderer = new GuildListRenderer(this);
        this.#channelsRenderer = new ChannelsRenderer(this);
        this.#rightMenuRenderer = new RightMenuRenderer(this);
        this.#messagesRenderer = new MessagesRenderer(this);
        this.#authMenuRenderer = new AuthMenuRenderer(this);
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

    getAuthMenuRenderer() {
        return this.#authMenuRenderer;
    }
}