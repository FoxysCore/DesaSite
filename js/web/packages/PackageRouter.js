import { b64Encode, b64Decode } from "../../utils/base64.js";
import { ChannelInfo } from "../../channels/ChannelInfo.js";

import { MessageType } from "../../messages/messages/MessageType.js";
import { ContentBlockType } from "../../messages/contentBlocks/ContentBlockType.js";

import { TextContentBlock } from "../../messages/contentBlocks/TextContentBlock.js";
import { UserMessage } from "../../messages/messages/UserMessage.js";

export class PackageRouter {
    #guild;

    constructor(guild) {
        this.#guild = guild;
    }

    routePackage(pkg) {
        switch (pkg.type) {
            case "SERVER_INFO":
                this.#guild.getInfo().update(
                    b64Decode(pkg.displayName),
                    b64Decode(pkg.description),
                    pkg.iconUrl,
                    pkg.bannerUrl,
                );
                break;


            case "AUTH_METHODS":
                for (const methodData of pkg.authMethods) {
                    this.#guild.getAuthManager().addMethod(
                        methodData.authMethodName, 
                        methodData.payload
                    );   
                }

                //break;
                const tokenMethod = this.#guild.getAuthManager().getMethod("defaultSessionTokenAuthMethod");
                if (!tokenMethod) {return;}
                tokenMethod.auth({});
                break;
                this.#guild.getConnection().sendPackage({
                    type: "AUTH",
                    authMethodName: "defaultSessionTokenAuthMethod",
                    userInfo: this.#guild.getGuildManager().getCore().getSettingsManager().getClientSettings().getCurrentUserInfo(),
                    authData: {
                        key: "123",
                        userId: "TEST".repeat(16)
                    }
                });
                break;

            case "AUTH_SUCCESS":
                this.#guild.getUserManager().setCurrentUser(pkg.userId);
                break;

            case "CHANNEL_CREATED":
                const category = this.#guild.getRootCategory().getChannel(pkg.channel.parentId);
                console.log(category);
                
                const channelInfo = new ChannelInfo();
                channelInfo.update(b64Decode(pkg.channel.info.b64DisplayName));
                
                category.createChild(pkg.channel.type, pkg.channel.id, channelInfo);
                break;

            case "USER_CREATED":
                const user = this.#guild.getUserManager().createUser(
                    pkg.user.id,
                    pkg.user.state,
                );
                user.getInfo().update(
                    b64Decode(pkg.user.info.b64DisplayName),
                    b64Decode(pkg.user.info.b64Description),
                    b64Decode(pkg.user.info.b64IconUrl),
                    b64Decode(pkg.user.info.b64BannerUrl),
                    pkg.user.info.updateTimeStamp
                );
                break;


            case "MESSAGE_SENT":
                const message = this.#getMessage(pkg.message);
                const channel = this.#guild.getRootCategory().getChannel(message.getChannelId());
                channel.reciveNewMessage(message, pkg.previousMessageTimestamp);
                break;
            
            case "MESSAGE_LIST":
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
    
}