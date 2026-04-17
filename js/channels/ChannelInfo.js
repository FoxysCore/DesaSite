export class ChannelInfo {
    #displayNameElement;


    constructor() {
        this.displayName = "";

        this.#displayNameElement = document.createElement("span");
        
        this.#displayNameElement.textContent = this.displayName;
        
    }

    getDisplayName() {
        return this.displayName;
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


    update(displayName) {
        this.displayName = displayName;
        
        this.#displayNameElement.textContent = this.displayName;
    }


    updateFromBytes(buffer) {
        this.update(buffer.getByteLengthString());
    }
}