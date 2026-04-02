//{
//"id": 0,
//"address": "127.0.0.1:2370",
//"sessionToken": "",
//"userId": ""
//}



export class GuildSettings {
    #settingsManager;

    constructor(settingsManager) {
        this.#settingsManager = settingsManager;
    }

    getGuildInfos() {
        const data = localStorage.getItem("savedGuilds");
        if (data === null) {return [];}
        return JSON.parse(data);
    }


    createGuild(guild) {
        const guildData = {
            id: guild.getId(),
            address: guild.getConnection().getAddress(),
            sessionToken: "",
            userId: ""
        }
        const list = this.getGuildInfos();
        list.push(guildData);
        this.#writeGuildList(list);
    }


    removeGuild(guild) {
        const list = this.getGuildInfos();
        for (guildInfo of list) {
            if (guildInfo.id === guild.getId()) {
            }
        }
    }

    getGuildSessionToken(id) {
        const list = this.getGuildInfos();
        for (const guild of list) {
            if (guild.id === id) {
                return guild.sessionToken;
            }
        }
        return "";
    }

    setGuildSessionToken(id, token) {
        const list = this.getGuildInfos();
        for (const guild of list) {
            if (guild.id === id) {
                guild.sessionToken = token;
            }
        }
        this.#writeGuildList(list);
    }

    getGuildUserId(id) {
        const list = this.getGuildInfos();
        for (const guild of list) {
            if (guild.id === id) {
                return guild.userId;
            }
        }
        return "";
    }

    setGuildUserId(id, userId) {
        const list = this.getGuildInfos();
        for (const guild of list) {
            if (guild.id === id) {
                guild.userId = userId;
            }
        }
        this.#writeGuildList(list);
    }


    #writeGuildList(list) {
        if (list === null) {list = [];}
        localStorage.setItem("savedGuilds", JSON.stringify(list));
    }

}