import { GuildState } from '../../guildState.js';


export function startAuth(guild, method) {

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${method.client_id}&redirect_uri=${method.redirect_uri}&response_type=code&scope=openid%20email&access_type=offline&prompt=consent&state=${guild.getId()}`;


    const width = 600, height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const popup = window.open(
        url,
        'google_auth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}




export function googleAuth(guild, code) {
    if (guild.state !== GuildState.UNLOGGED_IN) {return;}

    const b64profileSettings = JSON.parse(localStorage.getItem('profileSettings')) || {
        b64Username: b64Encode('NewUser'),
        b64Bio: '',
        b64Avatar: '',
        b64Banner: ''
      };

    guild.connection.sendMessage(JSON.stringify({
        type: "AUTH",
        userInfo: {
            b64DisplayName: b64profileSettings.b64Username,
            b64Description: b64profileSettings.b64Bio,
            b64IconUrl: b64profileSettings.b64Avatar,
            b64BannerUrl: b64profileSettings.b64Banner
        },
        authMethodName: "defaultGoogleAuthMethod",
        authData: {code: code.trim()}
    }));
}