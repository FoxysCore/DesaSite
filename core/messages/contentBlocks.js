import { b64Decode } from "../utils/base64.js";

export const MessageType = Object.freeze({
    TEXT: "TEXT"
});



class ContentBlock {
    getType() {}
    getDiv() {}
}

export class TextBlock extends ContentBlock {
    _div = null;
    _text;

    constructor(b64Text) {
        super();
        //<div class="message-text">
        this._text = b64Decode(b64Text);
        this._div = document.createElement("div");
        this._div.classList.add("message-text");
        this._div.textContent = this._text;
    }

    getType() {
        return MessageType.TEXT;
    }

    getDiv() {
        if (this._div === null) {
            this._div = document.createElement("div");
            this._div.
            this._div.textContent = this._text;
        }
        return this._div;
    }

}





export function getBlock(data) {
    console.log(data);
    if (data.ContentBlockType === MessageType.TEXT) {
        return new TextBlock(data.b64Text);
    }

}