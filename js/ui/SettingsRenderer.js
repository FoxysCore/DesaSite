export class SettingsRenderer {
    #renderer;
    #settingsMenu;
    #settingsContainer;
    #settingsMenuList;
    constructor(renderer) {
        this.#renderer = renderer;
        this.#settingsMenu = document.getElementById("settingsMenu");
        this.#settingsContainer = document.getElementById("settingsContainer");
        this.#settingsMenuList = document.getElementById("settingsMenuList");
        this.addPage("Профиль", () => {this.#renderUserInfoSettings();});
        this.addPage("Серверы", ()=>{this.#renderGuildList()});

        document.getElementById("settingsButton").addEventListener("click", () => {
            this.#settingsMenu.classList.toggle("open");
        });
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
        this.#clearScreen();
        const guildManager = this.#renderer.getCore().getGuildManager();

        const tableBlock = document.createElement("div");
        tableBlock.classList.add("menu-block");
        const table = document.createElement("table");
        table.classList.add("guild-table");
        tableBlock.appendChild(table);
        table.innerHTML = "<thead><tr><td>ID</td><td>Название</td><td>Адрес</td><td>Состояние</td></tr></thead></thead>"
        this.#settingsContainer.appendChild(tableBlock);
        const tBody = document.createElement("tbody");
        table.appendChild(tBody);


        for (const guild of guildManager.getGuilds()) {
            if (guild === guildManager.getHomeGuild()) {continue;}

            const guildDiv = document.createElement("div");
            guildDiv.classList.add("menu-block");

            const tr = document.createElement("tr");
            table.appendChild(tr);
            for (const content of [guild.getId(), guild.getInfo().getDisplayName(), guild.getConnection().getAddress(), guild.getConnection().getState()]) {
                const td = document.createElement("td");
                td.textContent = content;
                tr.appendChild(td);
            }
            tBody.appendChild(tr);

            const buttonsTd = document.createElement("td"); 
            tr.appendChild(buttonsTd);
            const removeBtn = document.createElement("div");
            removeBtn.classList.add("nemu-block");
            removeBtn.textContent = "-";
            removeBtn.addEventListener("click", () => {
                guildManager.removeGuild(guild.getId());
                this.#renderGuildList();
            })
            buttonsTd.appendChild(removeBtn);
        }



        const newGuildInputGroup = document.createElement("div");
        newGuildInputGroup.classList.add("menu-block");

        const inputField = document.createElement("input");
        inputField.classList.add("guild-ip-input");
        newGuildInputGroup.appendChild(inputField);

        const addGuildBtn = document.createElement("div");
        addGuildBtn.classList.add("menu-block");
        addGuildBtn.textContent = "Добавить"
        newGuildInputGroup.appendChild(addGuildBtn);

        addGuildBtn.addEventListener("click", () => {
            if (inputField.value === "") {return;}
            guildManager.createGuild(inputField.value);
            this.#renderGuildList();
        });



        this.#settingsContainer.appendChild(newGuildInputGroup);
    }
}