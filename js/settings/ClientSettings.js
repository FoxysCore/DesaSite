import { UserInfo } from "../users/UserInfo.js";


export class ClientSettings {
    #settingsManager;
    
    constructor(settingsManager) {
        this.#settingsManager = settingsManager;

        let openConfigPage = false;
        openConfigPage = (openConfigPage || (localStorage.getItem("currentUserInfo") === null));

        if (openConfigPage) {window.location.replace("setup.html");}
    }


    getCurrentUserInfo() {
        const str = localStorage.getItem("currentUserInfo");
        if (str === null) {return {
            b64DisplayName: "TmV3RGVzYVVzZXI=",
            b64Description: "UGxlYXNlLCB1cGRhdGUgeW91ciBwcm9maWxlIDop",
            b64IconUrl: "Li9mYXZpY29uLmljbw==",
            b64BannerUrl: "Li9mYXZpY29uLmljbw==",
            updateTimeStamp: 1
        };}

        return JSON.parse(str);
    }


    getSettingsManager() {return this.#settingsManager;}
}