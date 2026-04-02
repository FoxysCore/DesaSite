import { SettingsCategory, SettingsScope, RootSettingsCategory} from "./settingsChannels.js";
import { SettingsChannelType } from "./SettingsChannelType.js";


export class SettingsChannelManager {
    guild;
    rootCategory;
    #selectedChannel = null;

    constructor(guild) {
        this.guild = guild;
        this.rootCategory = new RootSettingsCategory(guild);
        
    }

    getChannel(name) {
        return this.rootCategory.search(name);
    }

    createChannel(channelType, parentName, name, settingsArea) {
        const parent = this.getChannel(parentName);
        if (parent === null) return;
        if (parent.getType() !== SettingsChannelType.CATEGORY) return;

        if (channelType === SettingsChannelType.CATEGORY) {
            new SettingsCategory(parent, name, this.guild);
        } else if (channelType === SettingsChannelType.SCOPE) {
            new SettingsScope(parent, name, this.guild, settingsArea);
        }
    }

    getSelectedChannel() {
        return this.#selectedChannel;
    }

    getRootCategory() {
        return this.rootCategory;
    }

    drawChannels() {
        document.getElementById("channelList").replaceWith(this.rootCategory.getDiv());
    }

    getSelectedChannel() {
        return this.#selectedChannel;
    }

    selectChannel(channelName) {
        const channel = this.getChannel(channelName);
        if (channel === null) return;

        if (this.#selectedChannel !== null) {
            this.#selectedChannel.unselect();
        }
        this.#selectedChannel = channel;
        channel.select();
    }
}