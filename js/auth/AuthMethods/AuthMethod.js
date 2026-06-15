export class AuthMethod{
    #authManager;
    constructor(authManager, payload) {
        this.#authManager = authManager;        
    }

    getAuthManager() {return this.#authManager;}

    getDisplayName() {return null;}

    getName() {return null;}

    selectMethod() {}

    auth(payload) {}
}