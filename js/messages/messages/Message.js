export class Message {
    #timestamp;
    #content = [];
    constructor(timestamp) {
        this.#timestamp = timestamp;
    }

    getTimestamp() {
        return this.#timestamp;
    }


    addContentBlock(contentBlock) {
            this.#content.push(contentBlock);
    }
    
    removeContentBlock(index) {
        if (index >= 0 && index < this.#content.length) {
            this.#content.splice(index, 1);
        }
    }

    getContent() {
        return this.#content;
    }

    getType() {
        return null;
    }


    json() {
        return "";
    }
}
