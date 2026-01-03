import { b64Decode } from "./utils/base64.js";


export class GuildInfo {
    #displayName;
    #description;
    #iconURL;

    constructor(data) {
        this.#displayName = b64Decode(data.displayName) || "";
        this.#description = b64Decode(data.description) || "";
        this.#iconURL = data.iconUrl;
    }

    getDisplayName() {
        return this.#displayName;
    }

    getDescription() {
        return this.#description;
    }

    getIconURL() {
        return this.#iconURL;
    }
}