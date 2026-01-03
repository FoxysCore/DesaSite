// ChannelManager.js

import { ChannelType } from './ChannelType.js';
import { Channel, Category, TextChannel, VoiceChannel, ChannelInfo, RootCategory } from './channels.js';

export class ChannelManager {
    guild;
    rootCategory;
    #selectedChannel = null;

    constructor(guild) {
        this.guild = guild;
        this.rootCategory = new RootCategory(guild);
        
    }

    getChannel(id) {
        return this.rootCategory.search(id);
    }

    createChannel(channelType, id, parentId, info) {
        const parent = this.getChannel(parentId);
        if (parent === null) return;
        if (parent.getType() !== ChannelType.CATEGORY) return;

        if (channelType === ChannelType.CATEGORY) {
            new Category(id, parent, info, this.guild);
        } else if (channelType === ChannelType.TEXT) {
            new TextChannel(id, parent, info, this.guild);
        } else if (channelType === ChannelType.VOICE) {
            new VoiceChannel(id, parent, info, this.guild);
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

    selectChannel(channelId) {
        const channel = this.getChannel(channelId);
        if (channel === null) return;

        if (this.#selectedChannel !== null) {
            this.#selectedChannel.unselect();
        }
        this.#selectedChannel = channel;
        channel.select();
    }
}