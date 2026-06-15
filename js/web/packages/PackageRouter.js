import { b64Encode, b64Decode } from "../../utils/base64.js";
import { ChannelType } from "../../channels/ChannelType.js"

import { UserState } from "../../users/UserState.js"

import { messageFromBytes } from "../../messages/messages/Message.js";
import { MessageType } from "../../messages/messages/MessageType.js";

import {ByteBuffer} from "../../utils/ByteBuffer.js"
import { Hash } from "../../utils/Hash.js";

export class PackageRouter {
    #guild;

    constructor(guild) {
        this.#guild = guild;
    }

    routePackage(pkg) {
        switch (pkg.type) {
            case "MESSAGE_LIST":
                break;
                for (const messageMap of pkg.messages) {
                    const message = this.#getMessage(messageMap);
                    const channel = this.#guild.getRootCategory().getChannel(message.getChannelId());
                    channel.reciveHistoryMessage(message);
                }

            
            }  
    }





    #getMessage(messageMap) {
        let message;
        switch (messageMap.type) {
            case MessageType.USER_MESSAGE:
                message = new UserMessage(
                    messageMap.timestamp,
                    messageMap.senderId,
                    messageMap.channelId
                );
                break;
        }

        for (const contentBlockMap of messageMap.content) {
            switch (contentBlockMap.ContentBlockType) {
                case ContentBlockType.TEXT:
                    const textContentBlock = new TextContentBlock(
                        b64Decode(contentBlockMap.b64Text)
                    );
                    message.addContentBlock(textContentBlock);
                    break;
            }
        }
        return message;
    }
    




    routeBytePackage(byteBuffer) {
        const type = byteBuffer.getByte();
        console.log("PackageType: ", type);

        switch (type) {
            case 0: {this.#routeServerInfoPkg(byteBuffer); break;}

            case 2: {this.#routeErrorPackage(byteBuffer); break;}

            case 3: {this.#routeAuthMethodsPkg(byteBuffer); break;}
            case 4: {this.#routeAuthSuccessPkg(byteBuffer); break;}

            case 5: {this.#routeChannelCreatePkg(byteBuffer); break;}

            case 11: {this.#routeUserCreatePkg(byteBuffer); break;}

            case 16: {this.#routeMessageSentPkg(byteBuffer); break;}

            case 18: {this.#routeMessageListPkg(byteBuffer); break;}

            case 19: {this.#routeFileRequestPkg(byteBuffer); break;}

            case 20: {this.#routeFileResponsePkg(byteBuffer); break;}

            case 21: {this.#routeFileNotFoundPkg(byteBuffer); break;}

        }

        return type
    }



    #routeServerInfoPkg(buffer) {
        this.#guild.getInfo().updateFromBytes(buffer);
    }


    #routeAuthMethodsPkg(buffer) {

        let size = buffer.getInt();

        while (size > 0) {
            size --;
            const methodName = buffer.getByteLengthString();
            console.log(methodName);

            let serverPayloadSize = buffer.getInt();
            const serverPayload = new ByteBuffer(serverPayloadSize);
            while (serverPayloadSize > 0) {
                serverPayload.put(buffer.get());
                serverPayloadSize --;
            }

            serverPayload.flip();

            this.#guild.getAuthManager().addMethod(
                methodName, 
                serverPayload
            );
            
        }
        const tokenMethod = this.#guild.getAuthManager().getMethod("defaultSessionTokenAuthMethod");
        console.log(tokenMethod);
        if (tokenMethod) {tokenMethod.auth({});}
    }


    #routeAuthSuccessPkg(buffer) {
        const userId = new Hash(buffer);
        const sessionToken = buffer.getByteLengthString();

        this.#guild.getUserManager().setCurrentUser(userId);
        const guildSettings = this
                    .#guild
                    .getGuildManager()
                    .getCore()
                    .getSettingsManager()
                    .getGuildSettings();

        guildSettings.setGuildUserId(this.#guild.getId(), userId);
        guildSettings.setGuildSessionToken(this.#guild.getId(), sessionToken);
    }
    

    #routeChannelCreatePkg(buffer) {
        let type;
        switch (buffer.get()) {
            case 0: {type = ChannelType.CATEGORY; break;}
            case 1: {type = ChannelType.TEXT; break;}
            case 2: {type = ChannelType.VOICE; break;}
            default: {type = ChannelType.CUSTOM; break;}
        }

        const id = buffer.getShort();
        const parentId = buffer.getShort();

        const category = this.#guild.getRootCategory().getChannel(parentId);
        const channel = category.createChild(type, id);
        channel?.getInfo().updateFromBytes(buffer);

    }


    #routeUserCreatePkg(buffer) {
        let state;
        switch (buffer.get()) {
            case 0: {state = UserState.ONLINE; break;}
            case 1: {state = UserState.OFFLINE; break;}
            case 2: {state = UserState.IDLE; break;}
            default: {state = UserState.DO_NOT_DISTURB; break;}
        }

        const id = new Hash(buffer);

        const userManager = this.#guild.getUserManager();

        let user = userManager.getUser(id, false);
        if (!user) {user = userManager.createUser(id, state);}

        user.getInfo().updateFromBytes(buffer);
    }


    #routeMessageSentPkg(buffer) {
        const prevMessageTimestamp = buffer.getLong();
        const message = messageFromBytes(buffer);
        const channel = this
                            .#guild
                            .getRootCategory()
                            .getChannel(
                                message.getChannelId()
                            );
        channel
                .reciveNewMessage(
                    message, 
                    prevMessageTimestamp
                );
    }

    #routeMessageListPkg(buffer) {
        let count = buffer.getInt();
        while (count > 0) {
            count --;
            const message = messageFromBytes(buffer);
            const channel = this
                .#guild
                .getRootCategory()
                .getChannel(
                    message.getChannelId()
                );
            channel.reciveHistoryMessage(message);
        }
    }

    #routeFileRequestPkg(buffer) {

        const hash = new Hash(buffer);
        console.log(19, hash.toHexString());

        const file = this
                        .#guild
                        .getGuildManager()
                        .getCore()
                        .getFileManager()
                        .getQueuedFile(
                            hash.toHexString()
                        );
        if (!file) {return;}

        const url = buffer.getShortLengthString();

        console.log(url);

        const response = fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
        });

        console.log(response);
    }

    #routeErrorPackage(byteBuffer) {
        console.log("ERR: scope: " + byteBuffer.getByteLengthString() + " desc: " + byteBuffer.getByteLengthString())
    }


    #routeFileResponsePkg(byteBuffer) {

        const fileUrl = byteBuffer.getShortLengthString();

        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = ""; 
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    }

    #routeFileNotFoundPkg(byteBuffer) {
        const hash = new Hash(byteBuffer);
        const fileName = byteBuffer.getByteLengthString();
        
        this.#guild.getGuildManager().getCore().getRenderer().getCenterMenuRenderer().openFileNotFound(fileName);
    }
}
