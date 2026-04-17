import { ContentBlockType } from "./ContentBlockType.js";
import { b64Encode } from "../../utils/base64.js";
import { getShortLengthStrSize } from "../../utils/byteStringUtils.js";

export class ContentBlock {

    getType() {return null;}

    json() {
        return "";
    }

    getCustomType() {}

    getAdditionByteLength() {}
    
    putAdditionInto(buffer) {}

    getByteSize() {
        return 1 + this.getAdditionByteLength();
    }

    putInto(buffer) {
        buffer.put(this.getCustomType());
        this.putAdditionInto(buffer);
    }
}


export class TextContentBlock extends ContentBlock {
    #text;
    
    constructor(text) {
        super();
        this.#text = text;
    }

    getType() {
        return ContentBlockType.TEXT;
    }

    getCustomType() {return 0;}

    getText() {
        return this.#text;
    }


    json() {
        return {
            ContentBlockType: ContentBlockType.TEXT,
            b64Text: b64Encode(this.#text)
        };
    }

    getAdditionByteLength() {return getShortLengthStrSize(this.getText())}
    
    putAdditionInto(buffer) {buffer.putShortLengthString(this.getText());}
}


export function contentBlockFromBytes(buffer) {
    const type = buffer.get();
    let block;
    switch (type) {
        case 0: {
            block = new TextContentBlock(buffer.getShortLengthString());
        }
    }
    return block;
}