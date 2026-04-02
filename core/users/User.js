// User.js

import { Role } from '../roles/role.js';

export const UserState = Object.freeze({
    OFFLINE: "OFFLINE",
    ONLINE: "ONLINE",
    UNKNOWN: "UNKNOWN"
});

export class UserInfo {
    #displayName;
    #description;
    #iconUrl;
    #bannerUrl;

    constructor(data) {
        const decoder = (b64) => {
            if (!b64) return "";
            try {
                return atob(b64);
            } catch (e) {
                return "";
            }
        };

        this.#displayName = decoder(data?.b64DisplayName || "");
        this.#description = decoder(data?.b64Description || "");
        this.#iconUrl = decoder(data?.b64IconUrl || "");
        this.#bannerUrl = decoder(data?.b64BannerUrl || "");
    }

    getDisplayName() { return this.#displayName; }
    getDescription() { return this.#description; }
    getIconUrl() { return this.#iconUrl; }
    getBannerUrl() { return this.#bannerUrl; }
}

export class User {
    _id;
    _state;
    _info;
    _roles = new Set();


    _displayNameSpan = document.createElement("span");
    _descriptionSpan = document.createElement("span");
    _iconImg = document.createElement("img");
    _bannerImg = document.createElement("img");

    constructor(state, id, userInfo) {
        this._state = state;
        this._id = id;
        this.setInfo(userInfo);
    }

    getId() { return this._id; }

    addRole(role) {
        this._roles.add(role);
    }

    removeRole(role) {
        this._roles.delete(role);
    }

    getState() { return this._state; }

    setState(state) {
        this._state = state;
    }

    getInfo() { return this._info; }

    setInfo(info) {
        this._displayNameSpan.textContent = info.getDisplayName();
        this._descriptionSpan.textContent = info.getDescription();
        this._iconImg.src = info.getIconUrl();
        this._bannerImg.src = info.getBannerUrl();

        this._info = info;
    }





    // DIVs

    getDisplayNameSpan() {
        const mirror = document.createElement('span');

        mirror.innerHTML = this._displayNameSpan.innerHTML;
        for (const attr of this._displayNameSpan.attributes) {
            mirror.setAttribute(attr.name, attr.value);
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                mirror.setAttribute(mutation.attributeName, this._displayNameSpan.getAttribute(mutation.attributeName));
            }
            else if (mutation.type === 'childList' || mutation.type === 'characterData') {
                mirror.innerHTML = this._displayNameSpan.innerHTML;
            }
            }
        });

        observer.observe(this._displayNameSpan, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });

        mirror.__observer = observer;

        return mirror;
    }










    getDescriptionSpan() {
        return this._descriptionSpan;
    }

    getBannerImg() {
        return this._bannerImg;
    }






    getIconImg() {
        const mirror = document.createElement('img');
        mirror.src = this._iconImg.src;
        mirror.alt = this._iconImg.alt;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                mirror.src = this._iconImg.src;
            }
            }
        });
        observer.observe(this._iconImg, {
            attributes: true,
            attributeFilter: ['src', 'alt'] // наблюдаем ТОЛЬКО за src
        });
        mirror.__observer = observer;

        return mirror;
    }


}






export class UnknownUser extends User {
    constructor() {
        super(UserState.UNKNOWN, "", new UserInfo({
            b64DisplayName: "VW5rbm93biBVc2Vy",
            b64Description: "?",
            b64IconUrl: "",
            b64BannerUrl: ""
        }));
    }

    setState(state) {}
}