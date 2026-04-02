import { getBlock } from "./contentBlocks.js";

export const MessageType = Object.freeze({
    USER_MESSAGE: "USER_MESSAGE",
    ONLINE: "NON_USER_MESSAGE"
});



class Message {
    _content = [];
    _timestamp;
    _div = null;

    constructor(content, timestamp) {
        //div class="message" data-user="User#1234"
        this._timestamp = timestamp;
        this._div = document.createElement("div");
        this._div.className = "message";
        this._div.dataset.timestamp = timestamp;

        const displayContent = document.createElement("div");
        displayContent.className = "message-content";
        this._div.appendChild(displayContent);

        for (const block of content) {
            const blockObj = getBlock(block);
            this._content.push(blockObj);
            displayContent.appendChild(blockObj.getDiv());
        }
    }

    getType() {}

    getDiv() {
        return this._div;
    }

}





export class UserMessage extends Message {
    _user;
    constructor(content, timestamp, user) {
        super(content, timestamp);
        this._user = user;

        this._div.dataset.user = user.getId();

        const displayName = document.createElement("div");
        displayName.className = "message-author";
        displayName.appendChild(user.getDisplayNameSpan());
        this._div.querySelector(".message-content").prepend(displayName);

        const avatarDiv = document.createElement("div");
        avatarDiv.className = "avatar";
        avatarDiv.innerHTML = '<div class="avatar-fallback"></div>';
        avatarDiv.prepend(user.getIconImg());
        this._div.prepend(avatarDiv);

        
    }


    getType() {
        return MessageType.USER_MESSAGE;
    }
}