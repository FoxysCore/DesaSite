import { Category } from "./channels/Category.js";

export class RootCategory extends Category {
    #guild;
    channels = {};

    constructor(guild) {
        super(null, 32767, null, null);
        this.#guild = guild;
        this.channels[this.getId()] = this;
        this._rootCategory = this;
    }

    getChannel(id) {
        return this.channels[id];
    }

    getGuild() {return this.#guild}
}