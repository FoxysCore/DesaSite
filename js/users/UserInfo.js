import {b64Encode} from "../utils/base64.js"
import { getByteLengthStrSize, getShortLengthStrSize } from "../utils/byteStringUtils.js";

export class UserInfo {
    #displayName;
    #description;
    #iconUrl;
    #bannerUrl;
    #updateTimestamp;
    
    #displayNameElement;
    #descriptionElement;
    #iconElement;
    #bannerElement;


    constructor() {
        this.#displayName = "";
        this.#description = "";
        this.#iconUrl = "";
        this.#bannerUrl = "";
        this.#updateTimestamp = Date.now();

        this.#displayNameElement = document.createElement("span");
        this.#descriptionElement = document.createElement("span");
        this.#iconElement = document.createElement("img");
        this.#bannerElement = document.createElement("img");

        this.#displayNameElement.textContent = this.#displayName;
        this.#descriptionElement.textContent = this.#description;
        this.#iconElement.src = this.#iconUrl;
        this.#bannerElement.src = this.#bannerUrl;

    }

    getDisplayName() {
        return this.#displayName;
    }

    getDescription() {
        return this.#description;
    }

    getIconUrl() {
        return this.#iconUrl;
    }

    getBannerUrl() {
        return this.#bannerUrl;
    }



    getDisplayNameElement() {
        const clone = this.#displayNameElement.cloneNode(true);
        const observer = new MutationObserver(() => {
            clone.textContent = this.#displayNameElement.textContent;
        });
        observer.observe(this.#displayNameElement, {
            characterData: true,
            childList: true,
            subtree: true,
            writable: false,
            configurable: false
        });

        return clone;
    }

    getDescriptionElement() {
        const clone = this.#descriptionElement.cloneNode(true);
        const observer = new MutationObserver(() => {
            clone.textContent = this.#descriptionElement.textContent;
        });
        observer.observe(this.#descriptionElement, {
            characterData: true,
            childList: true,
            subtree: true,
            writable: false,
            configurable: false
        });

        return clone;
    }

    getIconElement() {
        const clone = this.#iconElement.cloneNode(true);
        const observer = new MutationObserver(() => {
            clone.src = this.#iconElement.src;
        });
        observer.observe(this.#iconElement, {
            attributes: true,
            attributeFilter: ['src']
        });

        // Автоматическая очистка обсервера при сборке клона сборщиком мусора
        const registry = new FinalizationRegistry((obs) => obs.disconnect());
        registry.register(clone, observer);

        // Сохраняем ссылку на registry на клоне, чтобы она не была собрана раньше
        Object.defineProperty(clone, '__observerRegistry', {
            value: registry,
            enumerable: false,
            writable: false,
            configurable: false
        });

        return clone;
    }

    getBannerElement() {
        const clone = this.#bannerElement.cloneNode(true);
        const observer = new MutationObserver(() => {
            clone.src = this.#bannerElement.src;
        });
        observer.observe(this.#bannerElement, {
            attributes: true,
            attributeFilter: ['src']
        });

        // Автоматическая очистка обсервера при сборке клона сборщиком мусора
        const registry = new FinalizationRegistry((obs) => obs.disconnect());
        registry.register(clone, observer);

        // Сохраняем ссылку на registry на клоне, чтобы она не была собрана раньше
        Object.defineProperty(clone, '__observerRegistry', {
            value: registry,
            enumerable: false,
            writable: false,
            configurable: false
        });

        return clone;
    }

    getUpdateTimestamp() {
        return this.#updateTimestamp;
    }


    update(displayName, description, iconUrl, bannerUrl, updateTimestamp) {
        this.#displayName = displayName;
        this.#description = description;
        this.#iconUrl = iconUrl;
        this.#bannerUrl = bannerUrl;
        if (updateTimestamp === 0) {this.#updateTimestamp = Date.now();}
        else {this.#updateTimestamp = updateTimestamp;}

        this.#displayNameElement.textContent = this.#displayName;
        this.#descriptionElement.textContent = this.#description;
        this.#iconElement.src = this.#iconUrl;
        this.#bannerElement.src = this.#bannerUrl;
    }


    updateFromBytes(buffer) {
        this.update(
            buffer.getByteLengthString(), 
            buffer.getShortLengthString(), 
            buffer.getByteLengthString(), 
            buffer.getByteLengthString(),
            buffer.getLong()
        );
    }


    getByteSize() {
        return getByteLengthStrSize(this.getDisplayName()) + 
            getShortLengthStrSize(this.getDescription()) + 
            getByteLengthStrSize(this.getIconUrl())+ 
            getByteLengthStrSize(this.getBannerUrl()) + 8;
    }

    putInto(buffer) {
        buffer.putByteLengthString(this.getDisplayName());
        buffer.putShortLengthString(this.getDescription());
        buffer.putByteLengthString(this.getIconUrl());
        buffer.putByteLengthString(this.getBannerUrl());
        buffer.putLong(this.getUpdateTimestamp());
    }
}