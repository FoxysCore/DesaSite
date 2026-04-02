export class AuthMenuRenderer{
    #renderer;
    #authMenu;
    constructor(renderer) {
        this.#renderer = renderer;
        this.#authMenu = document.getElementById("authMenu");
    }

    renderOptions(guild) {
        this.#authMenu.innerHTML = "";
        for (const method of guild.getAuthManager().getMethods()) {
            this.#authMenu.appendChild(
                this.#getButtonElement(method)
            )
        }
        this.#authMenu.classList.remove("closed");
    }


    #closeMenu() {
        this.#authMenu.classList.add("closed");
    }

    #getButtonElement(authMethod) {
        const div = document.createElement("div");
        div.classList.add(".auth-method-button");
        div.classList.add(authMethod.getName());
        div.textContent = authMethod.getDisplayName();

        div.addEventListener("click", ()=>{
            this.#closeMenu();
            authMethod.selectMethod();
        })

        return div;
    }
}