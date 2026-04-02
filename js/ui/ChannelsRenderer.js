import { ChannelType } from "../channels/ChannelType.js";

export class ChannelsRenderer {
    #renderer;
    #channelList;
    #chatHeader;
    #channelsPanel;

    constructor(renderer) {
        this.#renderer = renderer;
        this.#channelList = document.getElementById("channelList");
        this.#chatHeader = document.getElementById("chatHeader");
        this.#channelsPanel = document.getElementById("channelsPanel");

        this.#chatHeader.addEventListener("click", () => {
            this.#channelsPanel.classList.toggle("collapsed");
            document.querySelector(".servers-panel").classList.toggle("collapsed");
            if (this.#channelsPanel.classList.contains("collapsed")) {return;}
            
            let channel = this.#channelList.querySelector(".channel-item.active");
            if (!channel) {return;}
            channel = channel.parentElement.parentElement;

            while (channel.classList.contains("CATEGORY")) {
                channel.classList.remove("closed");
                channel = channel.parentElement.parentElement;
            }
        });

        this.#channelList.addEventListener("click", (event) => {
            const channelElement = event.target.closest(".channel-item");
            if (!channelElement) return;

            if (channelElement.classList.contains("CATEGORY")) {
                channelElement.classList.toggle("closed");
            }

            else {
                this.#selectChannel(channelElement);
                const channel = this.getSelectedChannel();
                this.#renderer.getMessagesRenderer().renderChannelMessages(channel);
            }
        });
    }

    updateCategory(category) {
        let categoryChildrenElement;
        if (category.getId() === 32767) {
            categoryChildrenElement = this.#channelList;
        } else {
            categoryChildrenElement = document.getElementById(`channel-${category.getId()}`).querySelector(".category-children")
        }

        categoryChildrenElement.innerHTML = "";
        for (const channel of category.getChildren()) {
            const channelElement = this.#getChannelElement(channel);
            categoryChildrenElement.appendChild(channelElement);
            if (channel.getType() === ChannelType.CATEGORY) {
                this.updateCategory(channel);
            }
        }
    }





    #getChannelElement(channel) {
        const channelElement = document.createElement("div");
        channelElement.id = `channel-${channel.getId()}`;
        channelElement.classList.add("channel-item", channel.getType());


        switch (channel.getType()) {
            case ChannelType.CATEGORY:
                const categoryHeader = document.createElement("div");
                categoryHeader.className = "category-header";
                categoryHeader.appendChild(channel.getInfo().getDisplayNameElement());
                channelElement.appendChild(categoryHeader);

                const childrenDiv = document.createElement("div");
                childrenDiv.className = "category-children";
                channelElement.appendChild(childrenDiv);
                break;

            case ChannelType.TEXT:
                channelElement.appendChild(channel.getInfo().getDisplayNameElement());
                break;    


            case ChannelType.VOICE:
                channelElement.appendChild(channel.getInfo().getDisplayNameElement());
                break;
            
            default:
                throw new Error('Invalid channel type: ' + channel.getType());
        }
        return channelElement;
    }

    getSelectedChannel() {
        const selectedChannelElement = this.#channelList.querySelector(".channel-item.active");
        if (!selectedChannelElement) return null;
        const channelId = parseInt(selectedChannelElement.id.replace("channel-", ""));
        return this.#renderer.getGuildListRenderer().getSelectedGuild().getRootCategory().getChannel(channelId);
    }

    #selectChannel(channelElement) {
        const activeChannels = this.#channelList.querySelectorAll(".channel-item.active");
        activeChannels.forEach(el => el.classList.remove("active"));
        channelElement.classList.add("active");

        const channel = this.getSelectedChannel();
        this.#chatHeader.innerHTML = "";
        this.#chatHeader.appendChild(channel.getInfo().getDisplayNameElement());
    }
}