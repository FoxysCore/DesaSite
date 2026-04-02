import { Channel } from "./Channel.js";
import { ChannelType } from "../ChannelType.js";

export class TextChannel extends Channel {
    #messages = [];
    #lastMessageTimestamp = 0;

    constructor(rootCategory, id, parent, channelInfo) {
        super(rootCategory, id, parent, channelInfo);
        this.#fetchMessages(0, -128);
    }

    
    getType() {
        return ChannelType.TEXT;
    }


    getMessageAfter(timestamp) {
        let flag = false
        for (const message of this.#messages) {
            if (flag) {return message;}
            if (message.getTimestamp() === timestamp) {flag = true;}
        }
        return null;
    }

    getMessageBefore(timestamp) {
        if (this.#messages.length == 0) {return null;}
        if (timestamp === 0) {return this.#messages[this.#messages.length-1];}

        let flag = false
        for (const message of this.#messages.toReversed()) {
            if (flag) {return message;}
            if (message.getTimestamp() === timestamp) {flag = true;}
        }
        return null;
    }


    getMessage(timestamp) {
        for (const message of this.#messages) {
            if (message.getTimestamp() === timestamp) {
                return message;
            }
        }
        return null;
    }


    sendMessage(message) {
        this.getRootCategory().getGuild().getConnection().sendPackage({
            type: "MESSAGE_SEND",
            message: message.json()
        });
    }


    reciveHistoryMessage(message) {
        this.#lastMessageTimestamp = Math.max(
            this.#lastMessageTimestamp,
            message.getTimestamp()
        );


        if (this.#messages.length === 0) {
            this.#messages.push(message);
            return;
        }

        if (message.getTimestamp() < this.#messages[0].getTimestamp()) {
            this.#messages.unshift(message);
            return;
        }

        for (let i = this.#messages.length; i >= 0; i--) {
            const currentTimestamp = this.#messages[i].getTimestamp()
            if (message.getTimestamp() > currentTimestamp) {
                this.#messages.splice(i+1, 0, message);
            }
        }


    }


    reciveNewMessage(message, privTimestamp) {

        if (privTimestamp === 0 && this.#messages.length === 0) {
            this.#messages.push(message);
            this.#lastMessageTimestamp = message.getTimestamp()
            this._rootCategory.getGuild().getGuildManager().getCore().getRenderer().getMessagesRenderer().addNewMessage(message, this);
            return;
        }

        if (this.#messages.length === 0) {
            this.reciveHistoryMessage(message);
            return;
        }
        const firstMessageTs = this.#messages[0].getTimestamp();

        if (message.getTimestamp() > firstMessageTs && message.getTimestamp() < this.#lastMessageTimestamp) {
            this.reciveHistoryMessage(message);
            return;
        }

        if (privTimestamp === this.#messages[this.#messages.length-1].getTimestamp()) {
            this.#messages.push(message);
            this.#lastMessageTimestamp = message.getTimestamp()
            this._rootCategory.getGuild().getGuildManager().getCore().getRenderer().getMessagesRenderer().addNewMessage(message, this);
        }

    }


    setRendered(firstTimestamp, lastTimestamp) {
        console.log(firstTimestamp, lastTimestamp);


        for (let i = 0; i < this.#messages.length; i++) {
            if (i > 1) {break;}
            console.log(this.#messages[i]);
            if (this.#messages[i].getTimestamp() >= firstTimestamp) {
                this.#fetchMessages(this.#messages[0].getTimestamp(), -128);
                break;
            }
        }


        if (this.#messages.length > 0 && this.#messages[this.#messages.length-1].getTimestamp() == this.#lastMessageTimestamp) {return;}

        for (let i = 1; i <= this.#messages.length; i++) {
            if (i > 50) {break;}
            if (this.#messages[this.#messages.length - i].getTimestamp() <= lastTimestamp) {
                this.#fetchMessages(this.#messages[this.#messages.length-1].getTimestamp(), 127);
            }
        }
    }


    #fetchMessages(startTimestamp, count) {
        this.getRootCategory().getGuild().getConnection().sendPackage({
            type: "MESSAGE_REQUEST",
            channelId: this.getId(),
            startTimestamp: startTimestamp,
            count: count
        });
    }




}