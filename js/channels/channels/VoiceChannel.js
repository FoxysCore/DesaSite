import { ChannelType } from "../ChannelType.js";
import { TextChannel } from "./TextChannel.js";

export class VoiceChannel extends TextChannel {
    getType() {return ChannelType.VOICE;}
}