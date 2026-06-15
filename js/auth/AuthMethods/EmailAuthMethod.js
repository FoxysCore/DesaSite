import { ByteBuffer } from "../../utils/ByteBuffer.js";
import { getByteLengthStrSize } from "../../utils/byteStringUtils.js";
import { AuthMethod } from "./AuthMethod.js";

export class EmailAuthMethod extends AuthMethod{

    #serverClientId;
    #serverRedirectUri;
    #isEmailSended = false;

    constructor(authManager, payload) {
        super(authManager, payload);
    }
    
    getName() {
        return "EmailAuthMethod";
    }

    getDisplayName() {
        return "Email"
    }

    selectMethod() {

        const payload = new ByteBuffer(getByteLengthStrSize("pafytbot5@gmail.com") + 1);
        payload.put(1);
        payload.putByteLengthString("pafytbot5@gmail.com");
        payload.flip();

        if (!this.#isEmailSended) {
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
                payload
            );
            this.#isEmailSended = true;
        }
        
        const width = 600, height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;

        window.open(
            window.location.href + "/emailcodeentry.html?guildid="+JSON.stringify(this.getAuthManager().getGuild().getId()),
            'DesaAuth',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }

    auth(payload) {

        const userPayload = new ByteBuffer(getByteLengthStrSize(payload.code) + 1);
        userPayload.put(0);
        userPayload.putByteLengthString(payload.code);
        userPayload.flip();

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
            userPayload
        );


    }
}