import { Guild } from "./Guild.js";

export class HomeGuild extends Guild {
    constructor(guildManager) {
        super(guildManager, 0, "");
        this.getInfo().update(
            "Home",
            "This is a place for your friends :)",
            "https://cdn-icons-png.flaticon.com/512/1946/1946488.png",
            "https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
        )
    }
}