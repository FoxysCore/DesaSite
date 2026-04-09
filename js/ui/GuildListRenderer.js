import { ConnectionState } from "../web/ConnectionState.js";

export class GuildListRenderer {
    #renderer;
    #guildList;
    #homeGuildElement;
    #serverInfoElement;
    constructor(renderer) {
        this.#renderer = renderer;
        this.#guildList = document.getElementById("guildList");
        this.#serverInfoElement = document.getElementById("serverInfo");

        this.#homeGuildElement = this.#createGuildElement(
            this
            .#renderer
            .getCore()
            .getGuildManager()
            .getHomeGuild());
        this.#homeGuildElement.classList.replace("DISCONNECTED", "AUTHENTICATED")
        document.querySelector('.servers-panel').prepend(this.#homeGuildElement);

        this.#serverInfoElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this.#renderer.getRightMenuRenderer().openGuildInfo(this.getSelectedGuild());
        });

    }

    createGuild(guild) {
        const guildElement = this.#createGuildElement(guild);
        this.#guildList.appendChild(guildElement);
    }

    removeGuild(id) {
        const guildElement = document.getElementById("guild-" + id);
        if (!guildElement) {return;}
        guildElement.remove();
    }


    moveGuild(id, newPosition) {
        const guildElement = document.getElementById("guild-" + id);
        if (!guildElement) {return;}
        const referenceNode = this.#guildList.children[newPosition];
        this.#guildList.insertBefore(guildElement, referenceNode);
    }


    getSelectedGuild() {
        let selectedGuildElement = this.#guildList.querySelector(".server-icon.active");
        if (!selectedGuildElement) {
            selectedGuildElement = this.#homeGuildElement;
        }
        return this
            .#renderer
            .getCore()
            .getGuildManager()
            .getGuild(
                parseInt(
                    selectedGuildElement
                    .id
                    .replace("guild-", "")
                )
            );
    }


    selectGuild(id) {
        this.#homeGuildElement.classList.remove("active");
        this.#guildList.querySelectorAll(".server-icon").forEach(el => {
            el.classList.remove("active");
        });

        const guildElement = document.getElementById("guild-" + id);

        guildElement.classList.add("active");
        const guild = this.#renderer.getCore().getGuildManager().getGuild(id);
        this.#renderer.getChannelsRenderer().updateCategory(guild.getRootCategory());
        

        const header = this.#serverInfoElement.querySelector("h3");
        header.innerHTML = "";
        header.appendChild(guild.getInfo().getDisplayNameElement());

        this.#renderer.getMessagesRenderer().clear();

        if (guild.getConnection().getState() === ConnectionState.CONNECTED) {
            this
            .#renderer
            .getCenterMenuRenderer()
            .openAuthMethods(
                guild
                .getAuthManager()
                .getMethods()
            );
        }
    }


    setGuildConnectionState(id, state) {
        const guildElement = document.getElementById("guild-" + id);
        guildElement?.classList.remove("CONNECTED");
        guildElement?.classList.remove("DISCONNECTED");
        guildElement?.classList.remove("AUTHENTICATED");

        guildElement?.classList.add(state)
    }

    #createGuildElement(guild) {
        const guildElement = document.createElement("div");
        guildElement.id = "guild-" + guild.getId();
        guildElement.classList.add("server-icon");
        guildElement.classList.add(guild.getConnection().getState());
        const icon = guild.getInfo().getIconElement();
        guildElement.appendChild(icon);


        icon.addEventListener('mouseenter', () => {
            let tooltip = document.createElement('div');
            tooltip.className = 'server-tooltip';
            tooltip.appendChild(guild.getInfo().getDisplayNameElement());
            document.body.appendChild(tooltip);

            // Позиционирование
            const rect = icon.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 10}px`; // чуть выше иконки
        });

        icon.addEventListener('mouseleave', () => {
            document.querySelectorAll('.server-tooltip').forEach(tooltip => tooltip.remove());
        });



        guildElement.addEventListener('click', (event) => {
            this.selectGuild(guild.getId());
            event.stopImmediatePropagation();
        });




        return guildElement;
    }

}