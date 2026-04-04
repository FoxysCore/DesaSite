import {GoogleAuthMethod} from "./AuthMethods/GoogleAuthMethod.js"
import {SessionTokenAuthMethod} from "./AuthMethods/SessionTokenAuthMethod.js"

export class AuthManager {
    #guild;
    #methods = new Map();
    constructor(guild) {
        this.#guild = guild;
    }


    getGuild() {return this.#guild;}

    getMethod(name) {
        return this.#methods.get(name);
    }

    getMethods() {
        return this.#methods.values();
    }

    addMethod(methodName, payload) {
        let method = null;
        switch (methodName) {
            case "defaultSessionTokenAuthMethod":
                method = new SessionTokenAuthMethod(this, payload);
                break;

            case "defaultGoogleAuthMethod":
                method = new GoogleAuthMethod(this, payload);
                break;

            default: return;
        }

        this.#methods.set(method.getName(), method);
    }
    
}