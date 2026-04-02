import { Message } from "./Message.js";
import { MessageType } from "./MessageType.js";

export class UserMessage extends Message {
    #senderId;
    #channelId;

    constructor(timestamp, senderId, channelId) {
        super(timestamp);
        this.#senderId = senderId;
        this.#channelId = channelId;
    }


    getSenderId() {
        return this.#senderId;
    }

    getChannelId() {
        return this.#channelId;
    }

    getType() {
        return MessageType.USER_MESSAGE;
    }

    json() {
        return {
            type: this.getType(),
            timestamp: this.timestamp,
            channelId: this.getChannelId(),
            senderId: this.getSenderId(),
            content: this.getContent().map(block => block.json())
        };
    }


}