import { contentBlockFromBytes } from "../contentBlocks/ContentBlock.js";
import { MessageType } from "./MessageType.js";
import { getByteLengthStrSize, getShortLengthStrSize } from "../../utils/byteStringUtils.js";
import { Hash } from "../../utils/Hash.js";

export class Message {
    _channelId;
    _timestamp;
    #content = [];
    constructor(channelId, timestamp) {
        this._channelId = channelId;
        this._timestamp = timestamp;
    }


    getChannelId() {return this._channelId;}

    getTimestamp() {return this._timestamp;}

    addContentBlock(block) {
        this.#content.push(block);
    }

    getContent() {
        return this.#content;
    }

    getType() {
        return null;
    }

    getCustomType() {}
    getAdditionByteLength() {}
    putAdditionInto(buffer) {}

    getByteSize() {
        let sum = 15 + this.getAdditionByteLength();
        for (const block of this.getContent()) {
            sum += block.getByteSize();
        }
        return sum;
    }
    putInto(buffer) {
        buffer.put(this.getCustomType());
        buffer.putShort(this.getChannelId());
        buffer.putLong(this.getTimestamp());
        buffer.putInt(this.getContent().length);
        for (const block of this.getContent()) {
            block.putInto(buffer);
        }
        this.putAdditionInto(buffer);
    }

    json() {
        return "";
    }
}

export class UserMessage extends Message {
    #senderId;

    constructor(channelId, timestamp, senderId) {
        super(channelId, timestamp);
        this.#senderId = senderId;
    }


    getSenderId() {
        return this.#senderId;
    }

    getType() {
        return MessageType.USER_MESSAGE;
    }

    getCustomType() {return 0;}

    getAdditionByteLength() {
        return this.getSenderId().getByteSize();
    }

    putAdditionInto(buffer) {
        this.getSenderId().putInto(buffer);
    }
}


export function messageFromBytes(buffer) {
    const type = buffer.get();
    const channelId = buffer.getShort();
    const timestamp = buffer.getLong();

    let count = buffer.getInt();
    const content = [];

    while (count > 0) {
        count --;
        content.push(contentBlockFromBytes(buffer));
    }

    let message;

    switch (type) {
        case 0: {
            message = new UserMessage(channelId, timestamp, new Hash(buffer));
        }
    }

    message.getContent().push(...content);
    return message;
}
