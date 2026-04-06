export class SettingsRenderer {
    #renderer;
    #settingsContainer;
    #settingsMenuList;
    constructor(renderer) {
        this.#renderer = renderer;
        this.#settingsContainer = document.getElementById("settingsContainer");
        this.#settingsMenuList = document.getElementById("settingsMenuList");
        this.addPage("test1", () => {this.#renderUserInfoSettings();});
        this.addPage("test2", ()=>{this.#renderGuildList()});
    }


    #clearScreen() {
        this.#settingsContainer.innerHTML = "";
    }


    addPage(name, onSelect) {
        const channel = document.createElement("div");
        channel.classList.add("channel-item");
        channel.classList.add("SETTINGS");

        const nameElement = document.createElement("span");
        nameElement.textContent = name;
        channel.appendChild(nameElement);

        channel.addEventListener("click", () => {
            this.#settingsMenuList.querySelectorAll(".channel-item").forEach(
                (element) => {element.classList.remove("active");}                
            )
            channel.classList.add("active");
            this.#clearScreen();
            onSelect();
        });

        this.#settingsMenuList.appendChild(channel);
    }
    


    #renderUserInfoSettings() {
        const iconNameBlock = document.createElement("div");
        const description = document.createElement("div");
        const bannerBlock = document.createElement("div");

        iconNameBlock.classList.add("menu-block");
        description.classList.add("menu-block");
        bannerBlock.classList.add("menu-block");


        const iconElement = document.createElement("div");
        iconElement.classList.add("server-icon");
        iconElement.classList.add("active");
        iconElement.style.width = "6rem";
        iconElement.style.height = "6rem";

        //iconElement.appendChild();

        const nameElement = document.createElement("h3");
        nameElement.classList.add("menu-block");
        //nameElement.appendChild(user.getInfo().getDisplayNameElement());

        iconNameBlock.appendChild(iconElement);
        iconNameBlock.appendChild(nameElement);



        //description.appendChild(user.getInfo().getDescriptionElement());
        //const banner = user.getInfo().getBannerElement();
        //banner.style.width = "100%";
        //banner.style.height = "auto";
        //bannerBlock.appendChild(banner);



        this.#settingsContainer.appendChild(iconNameBlock);
        this.#settingsContainer.appendChild(description);
        this.#settingsContainer.appendChild(bannerBlock);
    }


    #renderGuildList() {
        const guildManager = this.#renderer.getCore().getGuildManager();

        for (const guild of guildManager.getGuilds()) {
            const guildDiv = document.createElement("div");
            guildDiv.classList.add("menu-block");

            const id = document.createElement("span");
            id.textContent = guild.getId();
            
            const addr = document.createElement("span");
            addr.textContent = guild.getConnection().getAddress();
            
            const state = document.createElement("span");
            state.textContent = guild.getConnection().getState();
            
            guildDiv.appendChild(id);
            guildDiv.appendChild(addr);
            guildDiv.appendChild(state);
            this.#settingsContainer.appendChild(guildDiv);
        }
    }
}