import { ContentBlock } from "./ContentBlock.js";
import { ContentBlockType } from "./ContentBlockType.js";
import { b64Encode } from "../../utils/base64.js";

export class TextContentBlock extends ContentBlock {
    #text;
    
    constructor(text) {
        super();
        this.#text = text;
    }

    getType() {
        return ContentBlockType.TEXT;
    }

    getText() {
        return this.#text;
    }

    json() {
        return {
            ContentBlockType: ContentBlockType.TEXT,
            b64Text: b64Encode(this.#text)
        };
    }
}