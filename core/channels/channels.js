// channels.js

import { ChannelType } from './ChannelType.js';
import { b64Encode } from '../utils/base64.js';

export class ChannelInfo {
    #displayName = "%name%"
    constructor(infoData) {
        // pass — nothing to do
    }

    getDisplayName() {
        return this.#displayName;
    }
}





export class Channel {
    _guild;
    _id;
    _parent = null;
    _info;
    _div;

    constructor(id, parent, channelInfo, guild) {
        this._guild = guild;
        this._id = id;
        this._parent = parent;
        this._info = channelInfo;

        this._div = document.createElement('div');
        this._div.dataset.channelId = id;
        this._div.className = `channel-item ${this.getType()}`;
        this._div.innerHTML = `<span>${channelInfo.getDisplayName()}</span><button class="edit-btn">✏️</button>`;

        parent?.getChildrenDiv().appendChild(this._div);

        if (this._parent !== null) {
            this._parent._channels.push(this);
        }


    }

    getParent() {
        return this._parent;
    }


    getId() {
        return this._id;
    }

    getType() {
        // Abstract — should be overridden
        throw new Error('getType must be implemented by subclass');
    }

    getInfo() {
        return this._info;
    }

    setInfo(channelInfo) {
        this._info = channelInfo;
    }

    search(id) {
        if (this._id === id) return this;
        return null;
    }

    move(target, position) {
        if (this._parent === null) return;

        const index = this._parent._channels.indexOf(this);
        if (index !== -1) {
            this._parent._channels.splice(index, 1);
        }

        target._channels.splice(position, 0, this);
    }

    remove(removeChildren) {
        if (this._parent === null) return;

        const index = this._parent._channels.indexOf(this);
        if (index !== -1) {
            this._parent._channels.splice(index, 1);
        }
    }


    select() {
        this._div.classList.add('active');
    }

    unselect() {
        this._div.classList.remove('active');
    }

    getDiv() {
        return this._div;
    }

    onClick() {
        this._guild.channelManager.selectChannel(this._id);
    }

}








export class Category extends Channel {
    _channels = [];
    _childrenDiv = document.createElement('div');


    constructor(id, parent, channelInfo, guild) {
        super(id, parent, channelInfo, guild);
        this._childrenDiv.className = "category-children";
        this._div.classList.add('closed');
        this._div.innerHTML = '<div class="category-header"><span>%name%</span><button class="edit-btn">✏️</button></div>';
        this._div.appendChild(this._childrenDiv);
    }



    getType() {
        return ChannelType.CATEGORY;
    }

    remove(removeChildren) {
        if (this._parent === null) return;

        for (const channel of this._channels.slice()) {
            if (removeChildren) {
                channel.remove(true);
            } else {
                channel.move(this._parent, 0);
            }
        }

        super.remove(removeChildren);
    }

    search(id) {
        let ret = super.search(id);
        if (ret !== null) return ret;

        for (const channel of this._channels) {
            ret = channel.search(id);
            if (ret !== null) return ret;
        }
        return null;
    }

    getChildrenDiv() {
        return this._childrenDiv;
    }

    open() {
        if (!this._div.classList.contains('closed')) return;
        this._div.classList.remove('closed');
    }

    close() {
        if (this._div.classList.contains('closed')) return;
        this._div.classList.add('closed');
    }

    onClick() {
        this._div.classList.toggle('closed');
    }

}




export class TextChannel extends Channel {
    
    #messageArea = document.createElement('div');

    constructor(id, parent, channelInfo, guild) {
        super(id, parent, channelInfo, guild);
        //<div class="messages-area" id="messagesArea">
        this.#messageArea.className = 'messages-area';
        this.#messageArea.id = 'messagesArea';
    }


    getType() {
        return ChannelType.TEXT;
    }


    select() {
        document.getElementById('messagesArea').replaceWith(this.#messageArea);
        document.getElementById('chatHeader').textContent = this.getInfo().getDisplayName();
        super.select();
        if (this.#messageArea.children.length === 0) {
            this._guild.connection.sendMessage(JSON.stringify({
                type: "MESSAGE_REQUEST",
                channelId: this._id,
                startTimestamp: 0,
                count: -128
            }));
        }
    }


    sendMessage(message) {
        //this.#messageArea.appendChild(message.getDiv())
        this.#messageArea.prepend(message.getDiv());
    }

    processMessage(text) {
        this._guild.connection.sendMessage(JSON.stringify({
            type: "MESSAGE_SEND",
            message: {
                type: "USER_MESSAGE",
                timestamp: 0,
                channelId: this._id,
                content: [{ContentBlockType: "TEXT", "b64Text": b64Encode(text)}]
            }
        }));
    }

}



export class VoiceChannel extends TextChannel {
    getType() {
        return ChannelType.VOICE;
    }
}




export class RootCategory extends Category {

    constructor(guild) {
        super(-32768, null, new ChannelInfo({}), guild);
        this._div = document.createElement('div');
        this._div.className = 'channel-list';
        this._div.id = 'channelList';

        this._div.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) return;

            const item = e.target.closest('.channel-item');
            if (!item) return;


            this._guild.channelManager.getChannel(parseInt(item.dataset.channelId)).onClick();
        });
    }

    move(channel, position) {}
    remove(channel, removeChildren) {}

    getDiv() {
        return this._div;
    }

    getChildrenDiv() {
        return this._div;
    }

    onClick() {}

}