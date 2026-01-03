// Connection.js

import { PkgManager } from './PkgManager.js';
import { b64Encode } from '../utils/base64.js';
import { GuildState } from '../guildState.js';

export class Connection {
    #guild;
    ip;
    port;
    #pkgManager;
    #socket = null;

    constructor(guild, ip, port) {
        this.#guild = guild;
        this.ip = ip;
        this.port = port;
        this.#pkgManager = new PkgManager(guild);
    }

    async connect() {
        const uri = `wss://${this.ip}:${this.port}`;
        this.#socket = new WebSocket(uri);

        this.#socket.onopen = () => {
            this.#guild.state = GuildState.UNLOGGED_IN;
            this.#guild.render();
        };

        this.#socket.onmessage = (event) => {
            console.log(event.data);
            try {
                const message = JSON.parse(event.data);
                this.#pkgManager.processPkg(message);
            } catch (e) {
                console.error("Failed to parse message:", e, event.data);
            }
        };

        this.#socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.#socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    async sendMessage(message) {
        if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
            this.#socket.send(message);
        } else {
            throw new Error("WebSocket is not open");
        }
    }
}