import { b64Decode } from "../utils/base64.js";

export class SettingsRenderer {
    #renderer;
    #settingsContainer;
    constructor(renderer) {
        this.#renderer = renderer;

        const settingsList = document.getElementById("settingsList"); 

        for (const element of document.getElementById("settingsPages").children) {
            const channel = document.createElement("div");
            channel.classList.add("channel-item");
            channel.classList.add("SETTINGS");

            const nameElement = document.createElement("span");
            console.log(element);
            nameElement.textContent = element.dataset.name;
            channel.appendChild(nameElement);

            channel.addEventListener("click", () => {
                for (const menu of document.getElementById("settingsPages").children) {
                    menu.classList.remove("active");
                }
                this.#updateUi(element.dataset.name);
                element.classList.add("active");

                for (const anotherChannel of settingsList.children) {
                    anotherChannel.classList.remove("active");
                }
                channel.classList.add("active");

            });

            settingsList.appendChild(channel);
            if (element.classList.contains("active")) {
                channel.click();
            }
        }


        document.getElementById("settingsAddGuildBtn").onclick = () => {
            if (document.getElementById("settingsGuildIpInput").value != "") {
                this
                    .#renderer
                    .getCore()
                    .getGuildManager()
                    .createGuild(
                        document
                        .getElementById("settingsGuildIpInput")
                        .value
                );
                this.#updateUi("Серверы");

            }
        }
    }

    
    #updateUi(name){
        switch (name) {
            case "Серверы":
                this.#renderGuildList();
                return;
            case "Профиль":
                this.#renderUserInfoSettings();
                return;
        }
    }


    #renderUserInfoSettings() {
        const clientSettings = this.#renderer.getCore().getSettingsManager().getClientSettings();
        const currentUserInfo = clientSettings.getCurrentUserInfo();

        const displayName = document.getElementById("settingsUserDisplayName");
        const description = document.getElementById("settingsUserDescription");
        const icon = document.getElementById("settingsUserIcon");
        const banner = document.getElementById("settingsUserBanner");

        const newDisplayName = document.getElementById("settingsNewUserDisplayName");
        const newDescription = document.getElementById("settingsNewUserDescription");
        const newIcon = document.getElementById("settingsNewUserIconUrl");
        const newBanner = document.getElementById("settingsNewUserBannerUrl");

        displayName.textContent = b64Decode(currentUserInfo.b64DisplayName);
        description.textContent = b64Decode(currentUserInfo.b64Description);
        icon.src = b64Decode(currentUserInfo.b64IconUrl);
        banner.src = b64Decode(currentUserInfo.b64BannerUrl);

        newDisplayName.value = b64Decode(currentUserInfo.b64DisplayName);
        newDescription.value = b64Decode(currentUserInfo.b64Description);
        newIcon.value = b64Decode(currentUserInfo.b64IconUrl);
        newBanner.value = b64Decode(currentUserInfo.b64BannerUrl);

        document.getElementById("settingsUserCancelButton").onclick = ()=>{this.#renderUserInfoSettings();}
        document.getElementById("settingsUserSaveButton").onclick = ()=>{
            this.#renderUserInfoSettings();
        }

        

    }


    #renderGuildList() {
        const guildManager = this.#renderer.getCore().getGuildManager();
        const tBody = document.getElementById("settingsGuildTable");
        tBody.innerHTML = "";


        for (const guild of guildManager.getGuilds()) {
            if (guild === guildManager.getHomeGuild()) {continue;}

            const tr = document.createElement("tr");
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
    }
}