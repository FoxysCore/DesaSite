import { ByteBuffer } from "../../utils/ByteBuffer.js";
import { getByteLengthStrSize, getShortLengthStrSize } from "../../utils/byteStringUtils.js";

export class PackageSender {

    #connection;
    
    constructor(connection) {
        this.#connection = connection;
    }

    sendAuthPackage(authMethod, userInfo, payload) {

        let size = 2 + getByteLengthStrSize(authMethod.getName()) + 
            userInfo.getByteSize() + 
            payload.limit;
        
        const buffer = ByteBuffer.allocate(size);
        buffer.putShort(0);
        buffer.putByteLengthString(authMethod.getName());
        userInfo.putInto(buffer);
        while (payload.limit != payload.position) {
            buffer.put(payload.get());
        }

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

    sendFileRequestPackage(channelId, hash, filename) {
        const buffer = ByteBuffer.allocate(4 + hash.getByteSize() + getByteLengthStrSize(filename));
        buffer.putShort(8);
        buffer.putShort(channelId);
        hash.putInto(buffer);
        buffer.putByteLengthString(filename);

        this.#connection.sendBytePackage(buffer);
    }
}