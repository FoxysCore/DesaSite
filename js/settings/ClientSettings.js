import { UserInfo } from "../users/UserInfo.js";
import { b64Encode, b64Decode } from "../utils/base64.js"
import { ByteBuffer } from "../utils/ByteBuffer.js";


class CurrenUserInfo extends UserInfo {
    constructor() {
        super();
        const str = localStorage.getItem("currentUserInfo");
        if (str === null) {
            this.update("NewDesaUser", "Please, update your profile :)", "./favicon.ico", "./favicon.ico", 1);
        } else {
            this.updateFromBytes(
                ByteBuffer.fromHexString(localStorage.getItem("currentUserInfo"))
            )
        }
    }

    update(displayName, description, iconUrl, bannerUrl, updateTimestamp) {
        super.update(displayName, description, iconUrl, bannerUrl, updateTimestamp);

        const buffer = ByteBuffer.allocate(this.getByteSize());
        this.putInto(buffer);

        localStorage.setItem("currentUserInfo", buffer.toHexString())



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
        return this.#currentUserInfo;
    }

    getUserInfo() {
        return this.#currentUserInfo;
    }




    getSettingsManager() {return this.#settingsManager;}
}