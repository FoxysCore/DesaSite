import { AuthMethod } from "./AuthMethod.js";

export class GoogleAuthMethod extends AuthMethod{
    
    getName() {
        return "defaultGoogleAuthMethod";
    }

    getDisplayName() {
        return "Google"
    }

    selectMethod() {
        console.log(this._payload);
        const state = JSON.stringify({methodName: this.getName(), guildId: this.getAuthManager().getGuild().getId()});
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this._payload.client_id}&redirect_uri=${this._payload.redirect_uri}&response_type=code&scope=openid%20email&access_type=offline&prompt=consent&state=${state}`;
        
        const width = 600, height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        window.open(
            url,
            'DesaAuth',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }

    auth(payload) {
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
            {code: payload.code}
        )

        //this.getAuthManager().getGuild().getConnection().sendPackage({
        //            type: "AUTH",
        //            authMethodName: this.getName(),
        //            userInfo: this.getAuthManager().getGuild().getGuildManager().getCore().getSettingsManager().getClientSettings().getCurrentUserInfo(),
        //            authData: {
        //                code: payload.code
        //            }
        //        });
    }
}