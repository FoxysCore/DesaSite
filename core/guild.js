// guild.js

import { ChannelManager } from './channels/ChannelManager.js';
import { RoleManager } from './roles/RoleManager.js';
import { UserManager } from './users/UserManager.js';
import { Connection } from './web/Connection.js';
import { b64Encode } from './utils/base64.js';

import { GuildState } from './guildState.js';

import { SettingsChannelManager } from './settings/settingsManager.js';


class GuildTemplate {
    core
    _serverIcon = null;


    constructor(core, id) {
        this.core = core;
        this._serverIcon = document.createElement('div');
        this._serverIcon.classList.add('server-icon');
        this._serverIcon.dataset.id = id;

        this._serverIcon.addEventListener('click', this.core.selectGuild.bind(this.core, id));
    }

    render() {
        document.querySelector('.servers-list').appendChild(this._serverIcon);
    }
    unrender() {
        document.querySelector('.servers-list').removeChild(this._serverIcon);
    }

    select() {
        this._serverIcon.classList.add('active');
    }

    unselect() {
        this._serverIcon.classList.remove('active');
    }

    getId() {
        return this._serverIcon.dataset.id;
    }
}


export class Guild extends GuildTemplate {
    connection = null;
    info = null;
    channelManager = null;
    roleManager = null;
    userManager = null;

    currentUserId = null;

    supportedAuthMethods = [];

    state = GuildState.CONNECTING;

    constructor(core, ip, port) {
        super(core, b64Encode(`${ip}:${port}`));

        this._serverIcon.dataset.name = "null";
        this._serverIcon.innerHTML = `<img src="" alt="Аватар" /><div class="server-avatar-fallback"></div>`;
        addTolltip(this._serverIcon);


        this.channelManager = new ChannelManager(this);
        this.roleManager = new RoleManager(this);
        this.userManager = new UserManager(this);

        this.connection = new Connection(this, ip, port); 
    }

    setInfo(info) {
        this.info = info;
        this._serverIcon.querySelector('img').src = info.getIconURL();
        this._serverIcon.dataset.name = info.getDisplayName();
    }

    select() {
        this.channelManager.drawChannels();
        this.channelManager.getSelectedChannel()?.select();
        document.getElementById("serverInfo").querySelector("h3").textContent = this.info.getDisplayName();
        super.select();
    }
    
}










export class HomeGuild extends GuildTemplate {
    channelManager = null;

    constructor(core) {
        super(core, "home_guild");

        this.state = GuildState.CONNECTED;

        this._serverIcon.dataset.name = "null";
        this._serverIcon.innerHTML = `<img src="" alt="Аватар" /><div class="server-avatar-fallback"></div>`;
        //addTolltip(this._serverIcon);

        this.channelManager = new SettingsChannelManager(this); 
    }

    render() {
      this._serverIcon.textContent = '⌂';
      document.querySelector('.servers-panel').prepend(this._serverIcon);
    }


    select() {
        document.getElementById("serverInfo").style.display = "none";
        document.getElementById("messageInputContainer").style.display = "none";
        this.channelManager.drawChannels();
        this.channelManager.getSelectedChannel()?.select();
        super.select();
    }

    unselect() {
        document.getElementById("serverInfo").style = "";
        document.getElementById("messageInputContainer").style = "";
        super.unselect();
    }
    
}
















function addTolltip(icon) {
    icon.addEventListener('mouseenter', () => {
        const name = icon.getAttribute('data-name');

        let tooltip = document.createElement('div');
        tooltip.className = 'server-tooltip';
        tooltip.innerHTML = `
          <div class="server-tooltip-avatar">
            <div class="server-tooltip-fallback" style="display:none;"></div>
          </div>
          <span>${name}</span>
        `;
        document.body.appendChild(tooltip);

        // Позиционирование
        const rect = icon.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`; // чуть выше иконки
      });

    icon.addEventListener('mouseleave', () => {
        document.querySelectorAll('.server-tooltip').forEach(tooltip => tooltip.remove());
      });
}