import { SettingsChannelType } from './SettingsChannelType.js';



export class SettingsChannel {
    _guild;
    _parent = null;
    _name;
    _div;

    constructor(parent, name, guild) {
        this._guild = guild;
        this._parent = parent;
        this._name = name;

        this._div = document.createElement('div');
        this._div.dataset.channelId = name;
        this._div.className = `channel-item ${this.getType()}`;
        this._div.innerHTML = `<span>${name}</span>`;

        parent?.getChildrenDiv().appendChild(this._div);

        if (this._parent !== null) {
            this._parent._channels.push(this);
        }


    }

    getParent() {
        return this._parent;
    }


    getName() {
        return this.name;
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

    search(name) {
        if (this._name === name) return this;
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
        this._guild.channelManager.selectChannel(this._name);
    }

}



export class SettingsCategory extends SettingsChannel {
    _channels = [];
    _childrenDiv = document.createElement('div');


    constructor(parent, name, guild) {
        super(parent, name, guild);
        this._childrenDiv.className = "category-children";
        this._div.classList.add('closed');
        this._div.innerHTML = `<div class="category-header"><span>${name}</span>`;
        this._div.appendChild(this._childrenDiv);
    }



    getType() {
        return SettingsChannelType.CATEGORY;
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

    search(name) {
        let ret = super.search(name);
        if (ret !== null) return ret;

        for (const channel of this._channels) {
            ret = channel.search(name);
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



export class SettingsScope extends SettingsChannel {
    
    #settingsArea;

    constructor(parent, name, guild, settingsArea = document.createElement('div')) {
        super(parent, name, guild);
        this.#settingsArea = settingsArea;
        this.#settingsArea.className = 'settings-area';
        this.#settingsArea.id = 'messagesArea';
    }


    getType() {
        return SettingsChannelType.SCOPE;
    }


    select() {
        document.getElementById('messagesArea').replaceWith(this.#settingsArea);
        document.getElementById('chatHeader').textContent = this._name;
        super.select();
    }
}



export class RootSettingsCategory extends SettingsCategory {

    constructor(guild) {
        super(null, "root", guild);
        this._div = document.createElement('div');
        this._div.className = 'channel-list';
        this._div.id = 'channelList';

        this._div.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) return;

            const item = e.target.closest('.channel-item');
            if (!item) return;


            this._guild.channelManager.getChannel(item.dataset.channelId).onClick();
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