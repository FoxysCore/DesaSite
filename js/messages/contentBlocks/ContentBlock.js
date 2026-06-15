import { ContentBlockType } from "./ContentBlockType.js";
import { b64Encode } from "../../utils/base64.js";
import { getByteLengthStrSize, getShortLengthStrSize } from "../../utils/byteStringUtils.js";
import { Hash } from "../../utils/Hash.js";

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


export class FileContentBlock extends ContentBlock {
    #size;
    #filename;
    #hash;
    
    constructor(size, filename, hash) {
        super();
        this.#size = size;
        this.#filename = filename;
        this.#hash = hash;
    }

    getType() {
        return ContentBlockType.FILE;
    }

    getCustomType() {return 2;}
    

    getSize() {return this.#size;}

    getFileName() {return this.#filename;}

    getHash() {return this.#hash;}


    json() {
        return {
            ContentBlockType: ContentBlockType.FILE,
            b64Text: b64Encode(this.#hash)
        };
    }

    getAdditionByteLength() {return 4 + getByteLengthStrSize(this.getFileName()) + this.getHash().getByteSize();}
    
    putAdditionInto(buffer) {
        buffer.putInt(this.getSize());
        buffer.putByteLengthString(this.getFileName());
        this.getHash().putInto(buffer);
    }
}


export function contentBlockFromBytes(buffer) {
    const type = buffer.get();
    let block;
    switch (type) {
        case 0: {
            block = new TextContentBlock(buffer.getShortLengthString());
            break;
        }
        case 2: {
            block = new FileContentBlock(
                buffer.getInt(),
                buffer.getByteLengthString(),
                new Hash(buffer)
            );
            break;
        }
        
    }
    return block;
}