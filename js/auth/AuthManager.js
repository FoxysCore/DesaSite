import {GoogleAuthMethod} from "./AuthMethods/GoogleAuthMethod.js"
import {SessionTokenAuthMethod} from "./AuthMethods/SessionTokenAuthMethod.js"
import { EmailAuthMethod } from "./AuthMethods/EmailAuthMethod.js";

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

    addMethod(methodName, serverPayload) {
        let method = null;
        switch (methodName) {
            case "defaultSessionTokenAuthMethod":
                method = new SessionTokenAuthMethod(this, serverPayload);
                break;

            case "GoogleAuthMethod":
                method = new GoogleAuthMethod(this, serverPayload);
                break;

            case "EmailAuthMethod":
                method = new EmailAuthMethod(this, serverPayload);
                break;

            default: return;
        }

        this.#methods.set(method.getName(), method);
    }
    
}