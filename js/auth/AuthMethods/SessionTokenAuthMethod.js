import { AuthMethod } from "./AuthMethod.js";

export class SessionTokenAuthMethod extends AuthMethod{
    
    getName() {
        return "defaultSessionTokenAuthMethod";
    }

    getDisplayName() {
        return "Токен";
    }

    selectMethod() {
        this.auth({});
    }

    auth(payload) {
        const guild = this
            .getAuthManager()
            .getGuild();
        const guildSettings = guild 
            .getGuildManager()
            .getCore()
            .getSettingsManager()
            .getGuildSettings();

        const userId = guildSettings.getGuildUserId(guild.getId());
        const token = guildSettings.getGuildSessionToken(guild.getId());

        if (token != "") {
            this.getAuthManager().getGuild().getConnection().getPackageSender().sendAuthPackage(
                this,
                this
                    .getAuthManager()
                    .getGuild()
                    .getGuildManager()
                    .getCore()
                    .getSettingsManager()
                    .getClientSettings()
                    .getUserInfo(),
                {key: token, userId: userId}
            )






            
            //guild.getConnection().sendPackage({
            //    type: "AUTH",
            //    authMethodName: "defaultSessionTokenAuthMethod",
            //    userInfo: guildSettings.getSettingsManager().getClientSettings().getCurrentUserInfo(),
            //    authData: {
            //        key: token,
            //        userId: userId
            //    }
            //});
        }
    }
}