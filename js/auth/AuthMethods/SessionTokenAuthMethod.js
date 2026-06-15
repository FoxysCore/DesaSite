import { ByteBuffer } from "../../utils/ByteBuffer.js";
import { AuthMethod } from "./AuthMethod.js";
import { getByteLengthStrSize } from "../../utils/byteStringUtils.js";

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

            const clientPayload = new ByteBuffer(
                userId.getByteSize() +
                getByteLengthStrSize(token)               
            );

            clientPayload.putByteLengthString(token);
            userId.putInto(clientPayload);
            clientPayload.flip();

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
                clientPayload
            );
        }
    }
}