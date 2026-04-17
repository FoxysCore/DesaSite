import { UserInfo } from "../users/UserInfo.js";
import { b64Encode, b64Decode } from "../utils/base64.js"


class CurrenUserInfo extends UserInfo {
    constructor() {
        super();
        const str = localStorage.getItem("currentUserInfo");
        if (str === null) {
            this.update("NewDesaUser", "Please, update your profile :)", "./favicon.ico", "./favicon.ico", 1);
        } else {
            const infoJson = JSON.parse(str);
            super.update(
                b64Decode(infoJson.b64DisplayName),
                b64Decode(infoJson.b64Description),
                b64Decode(infoJson.b64IconUrl),
                b64Decode(infoJson.b64BannerUrl),
                infoJson.updateTimeStamp
            )
        }
    }

    update(displayName, description, iconUrl, bannerUrl, updateTimestamp) {
        super.update(displayName, description, iconUrl, bannerUrl, updateTimestamp);
        localStorage.setItem("currentUserInfo", JSON.stringify(this.json()))
    }
}



export class ClientSettings {
    #settingsManager;
    #currentUserInfo;
    
    constructor(settingsManager) {
        this.#settingsManager = settingsManager;
        this.#currentUserInfo = new CurrenUserInfo(this);

        let openConfigPage = false;
        openConfigPage = (openConfigPage || (localStorage.getItem("currentUserInfo") === null));

        if (openConfigPage) {window.location.replace("setup.html");}
    }

    setCurrentUserInfo(info) {} 

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

    getUserInfo() {
        return this.#currentUserInfo;
    }




    getSettingsManager() {return this.#settingsManager;}
}