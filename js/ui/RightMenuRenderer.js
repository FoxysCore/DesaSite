export class RightMenuRenderer {
    #rightMenu;
    #renderer;

    constructor(renderer) {
        this.#renderer = renderer;
        this.#rightMenu = document.getElementById("rightMenu");
    }


    close() {
        this.#rightMenu.classList.remove("open");
        this.#rightMenu.innerHTML = "";
    }

    openUserInfo(user) {
        this.#rightMenu.innerHTML = "";
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

        iconElement.appendChild(user.getInfo().getIconElement());

        const nameElement = document.createElement("h3");
        nameElement.classList.add("menu-block");
        nameElement.appendChild(user.getInfo().getDisplayNameElement());

        iconNameBlock.appendChild(iconElement);
        iconNameBlock.appendChild(nameElement);



        description.appendChild(user.getInfo().getDescriptionElement());
        const banner = user.getInfo().getBannerElement();
        banner.style.width = "100%";
        banner.style.height = "auto";
        bannerBlock.appendChild(banner);



        this.#rightMenu.appendChild(iconNameBlock);
        this.#rightMenu.appendChild(description);
        this.#rightMenu.appendChild(bannerBlock);
        this.#rightMenu.classList.add("open");
    }


    openGuildInfo(guild) {
        this.#rightMenu.innerHTML = "";
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

        iconElement.appendChild(guild.getInfo().getIconElement());

        const nameElement = document.createElement("h3");
        nameElement.classList.add("menu-block");
        nameElement.appendChild(guild.getInfo().getDisplayNameElement());

        iconNameBlock.appendChild(iconElement);
        iconNameBlock.appendChild(nameElement);



        description.appendChild(guild.getInfo().getDescriptionElement());
        const banner = guild.getInfo().getBannerElement();
        banner.style.width = "100%";
        banner.style.height = "auto";
        bannerBlock.appendChild(banner);



        this.#rightMenu.appendChild(iconNameBlock);
        this.#rightMenu.appendChild(description);
        this.#rightMenu.appendChild(bannerBlock);
        this.#rightMenu.classList.add("open");
    }


}