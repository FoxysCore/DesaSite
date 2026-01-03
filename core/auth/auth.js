import { GuildState } from '../guildState.js';
import { googleAuth, startAuth } from './methods/googleAuth.js';

export function auth(guild) {
    if (guild.state !== GuildState.UNLOGGED_IN) {return;}
    for (const method of guild.supportedAuthMethods) {
        if (method.authMethodName === "defaultGoogleAuthMethod") {
            startAuth(guild, method);
        }
    }
}


export function postAuthDataSend(guild, methodname, data) {
    if (methodname === "defaultGoogleAuthMethod") {
        googleAuth(guild, data);
    }
}