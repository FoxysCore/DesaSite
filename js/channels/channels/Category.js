import { Channel } from "./Channel.js";
import { TextChannel } from "./TextChannel.js";
import { VoiceChannel } from "./VoiceChannel.js";
import { ChannelType } from "../ChannelType.js";

export class Category extends Channel {
    _children = [];

    getType() {return ChannelType.CATEGORY;}

    createChild(channelType, id, channelInfo) {
        let newChannel;
        switch (channelType) {
            case ChannelType.TEXT:
                newChannel = new TextChannel(this._rootCategory, id, this, channelInfo);
                break;
            case ChannelType.VOICE:
                newChannel = new VoiceChannel(this._rootCategory, id, this, channelInfo);
                break;
            case ChannelType.CATEGORY:
                newChannel = new Category(this._rootCategory, id, this, channelInfo);
                break;
            default:
                throw new Error('Invalid channel type: ' + channelType);
        }

        this._children.push(newChannel);
        this._rootCategory.channels[id] = newChannel;
        return newChannel;
    }

    getChildren() {return this._children;}


    removeChild(id) {
        const target = this._rootCategory._channels[id];

        if (target.getType() == ChannelType.CATEGORY) {
            for (const child of target.getChildren()) {
                child._parent = this;
                this._children.push(child);
            }
        }
        const index = this._children.indexOf(target);
        this._children.splice(index, 1);
        delete this._rootCategory._channels[id];
    }

    clear() {
        for (const child of this._children) {
            if (child.getType() == ChannelType.CATEGORY) {
                child.clear();
            }
            delete this._rootCategory._channels[child.getId()];
        }
        this._children = [];
    }
}