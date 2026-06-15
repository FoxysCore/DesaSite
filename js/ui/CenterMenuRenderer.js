export class CenterMenuRenderer{
    #renderer;
    #centerMenu;

    constructor(renderer) {
        this.#renderer = renderer;
        this.#centerMenu = document.getElementById("centerMenu");
    }


    close() {
        this.#centerMenu.classList.remove("open");
        this.#centerMenu.innerHTML = "";
    }


    openAuthMethods(methods) {
        this.close();
        for (const method of methods) {
            const div = document.createElement("div");
            div.classList.add("menu-block");
            div.classList.add(method.getName());
            div.textContent = method.getDisplayName();

            div.addEventListener("click", ()=>{
                this.close();
                method.selectMethod();
            });

            this.#centerMenu.appendChild(div);
        }

        this.#centerMenu.classList.add("open");
    }

    openFileNotFound(filename) {
        this.close();
        const div = document.createElement("div");
        div.classList.add("menu-block");
        div.textContent = `Файл ${filename} не был найден на сервере.\nВозможно, он был удалён или более недоступен в этом чате.`
        this.#centerMenu.appendChild(div);
        this.#centerMenu.classList.add("open");
    }
}