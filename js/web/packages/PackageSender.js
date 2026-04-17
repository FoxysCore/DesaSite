import { ByteBuffer } from "../../utils/ByteBuffer.js";
import { getByteLengthStrSize, getShortLengthStrSize } from "../../utils/byteStringUtils.js";

export class PackageSender {

    #connection;
    
    constructor(connection) {
        this.#connection = connection;
    }

    sendAuthPackage(authMethod, userInfo, payload) {

        const payloadString = JSON.stringify(payload); 

        let size = 2 + getByteLengthStrSize(authMethod.getName()) + 
            userInfo.getByteSize() + 
            getShortLengthStrSize(payloadString);
        
        const buffer = ByteBuffer.allocate(size);
        buffer.putShort(0);
        buffer.putByteLengthString(authMethod.getName());
        userInfo.putInto(buffer);
        buffer.putShortLengthString(payloadString);

        this.#connection.sendBytePackage(buffer);
    }

    sendMessagesRequestPkg(channel, startTimestamp, count) {
        const buffer = ByteBuffer.allocate(13);
        buffer.putShort(7);
        buffer.putShort(channel.getId());
        buffer.putLong(startTimestamp);
        buffer.putByte(count);
        this.#connection.sendBytePackage(buffer);
    }

    sendMessageSendPkg(message) {
        let size = 2 + message.getByteSize();
        console.log(size);
        const buffer = ByteBuffer.allocate(size);
        buffer.putShort(5);
        message.putInto(buffer);
        this.#connection.sendBytePackage(buffer);
    }
}