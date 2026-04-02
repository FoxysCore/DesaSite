export class AuthMethod{
    #authManager;
    _payload;
    constructor(authManager, payload) {
        this.#authManager = authManager;
        this._payload = payload;        
    }

    getAuthManager() {return this.#authManager;}

    getPayload() {return this._payload;}

    getDisplayName() {return null;}

    getName() {return null;}

    selectMethod() {}

    auth(payload) {}
}