// PkgManager.js

import { GuildInfo } from '../GuildInfo.js';
import { GuildState } from '../guildState.js';
import { ChannelInfo } from '../channels/channels.js';
import { ChannelType } from '../channels/ChannelType.js';
import { RoleInfo } from '../roles/role.js';
import { UserInfo, UserState } from '../users/User.js';
import { MessageType, UserMessage } from '../messages/message.js';

import { b64Encode } from '../utils/base64.js';

export class PkgManager {
    #guild;

    constructor(guild) {
        this.#guild = guild;
    }

    processPkg(data) {
        switch (data.type) {

            case "SERVER_INFO":
                return this.#guild.setInfo(new GuildInfo(data));


            case "CHANNEL_CREATED":
                return this.channel_create(data.channel);
            case "CHANNEL_REMOVER":
                return this.channel_remove(data.channelId, data.remove_children);

            case "ROLE_CREATED":
                return this.role_create(data.role);
            case "ROLE_REMOVED":
                return this.role_remove(data.roleId);

            case "USER_CREATED":
                return this.user_create(data.user);



            case "MESSAGE_SENT": 
                return this.message_send(data.message);


            case "MESSAGE_LIST":
                for (const messageData of data.messages.reverse()) {
                    this.message_send(messageData);
                }
                return;


            case "AUTH_METHODS":
                this.#guild.supportedAuthMethods = data.authMethods;
                return;


            case "AUTH_SUCCESS":
                this.#guild.currentUserId = data.userId;
                this.#guild.state = GuildState.CONNECTED;
                return;


            default:
                // Unknown packet type — ignore or log if needed
                break;
        }
    }

    channel_create(channelData) {
        const info = new ChannelInfo(channelData.info);
        const channelType = channelData.type; // should match ChannelType values
        this.#guild.channelManager.createChannel(
            channelType,
            channelData.id,
            channelData.parent_id,
            info
        );
    }

    channel_remove(channelId, removeChildren) {
        const channel = this.#guild.channelManager.getChannel(channelId);
        if (channel) {
            channel.remove(removeChildren);
        }
    }

    role_create(roleData) {
        const info = new RoleInfo(roleData.info);
        this.#guild.roleManager.createRole(
            roleData.id,
            roleData.priority,
            info
        );
    }

    role_remove(roleId) {
        const role = this.#guild.roleManager.getRole(roleId);
        if (role !== null) {
            this.#guild.roleManager.removeRole(role);
        }
    }

    user_create(userData) {
        const info = new UserInfo(userData.info);
        const state = userData.state; // should match UserState values
        const roles = new Set();
        // for (const roleId of userData.roles) {
        //     const role = this.#guild.roleManager.getRole(roleId);
        //     if (role !== null) {
        //         roles.add(role);
        //     }
        // }

        this.#guild.userManager.createUser(
            state,
            userData.id,
            roles,
            info
        );
    }















    message_send(messageData) {
        if (messageData.type === MessageType.USER_MESSAGE) {
            let user = this.#guild.userManager.getUser(messageData.senderId);
            if (user === null) {user = this.#guild.userManager.getUnknownUser();}
            const channel = this.#guild.channelManager.getChannel(messageData.channelId);
            if (channel !== null && channel.type !== ChannelType.CATEGORY) {
                const message = new UserMessage(
                    messageData.content,
                    messageData.timestamp,
                    user
                );
                channel.sendMessage(message);
            }
        }
    }



















    authMethods(authMethods) {
        for (const method of authMethods) {
            if (method.authMethodName === "DefaultKeyAuthMethod") {}
            if (method.authMethodName === "defaultGoogleAuthMethod") {


                // Где-то в асинхронном коде
                let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${method.client_id}&redirect_uri=${method.redirect_uri}&response_type=code&scope=openid%20email&access_type=offline&prompt=consent`;


                let code = prompt("Введите код авторизации:");
                while (code === null || code.trim() === "") {
                    code = prompt("Код авторизации не может быть пустым. Пожалуйста, введите код:");
                }


                const b64profileSettings = localStorage.getItem("profileSettings") || {
                    b64Username: b64Encode('NewUser'),
                    b64Bio: '',
                    b64Avatar: '',
                    b64Banner: ''
                };

                this.#guild.connection.sendMessage(JSON.stringify({
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
        }
    }
}