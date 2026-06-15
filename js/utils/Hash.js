export class Hash {
    _part1;
    _part2;
    _part3;
    _part4;

    constructor(buffer) {
        // Оригинальная логика: чтение из ByteBuffer
        this._part1 = buffer.getLong();
        this._part2 = buffer.getLong();
        this._part3 = buffer.getLong();
        this._part4 = buffer.getLong();
    }

    /**
     * Статический фабричный метод для создания Hash из hex-строки
     * @param {string} hexString - 64-символьная hex-строка (опционально с префиксом 0x)
     * @returns {Hash}
     */
    static fromHexString(hexString) {
        const cleanHex = hexString.replace(/^0x/i, '').toLowerCase();
        
        if (cleanHex.length !== 64) {
            throw new Error('Hex string must be exactly 64 characters long (32 bytes / 256 bits)');
        }

        // Создаем экземпляр без вызова конструктора (чтобы не требовать buffer)
        const instance = Object.create(Hash.prototype);
        
        // Парсим как BigInt для сохранения точности, затем приводим к Number, 
        // так как ByteBuffer.putLong() ожидает Number (ограничение предоставленного ByteBuffer)
        instance._part1 = BigInt('0x' + cleanHex.substring(0, 16));
        instance._part2 = BigInt('0x' + cleanHex.substring(16, 32));
        instance._part3 = BigInt('0x' + cleanHex.substring(32, 48));
        instance._part4 = BigInt('0x' + cleanHex.substring(48, 64));
        
        return instance;
    }

    getByteSize() {
        return 32;
    }

    putInto(buffer) {
        buffer.putLong(this._part1);
        buffer.putLong(this._part2);
        buffer.putLong(this._part3);
        buffer.putLong(this._part4);
    }

    /**
     * Преобразует 4 части хеша в единую 64-символьную hex-строку
     * @returns {string}
     */
    toHexString() {
        const toHex = (part) => {
            // Приводим к BigInt. Если часть отрицательная (из-за особенности getLong в JS),
            // мы применяем битовую маску & 0xFFFFFFFFFFFFFFFFn, чтобы получить корректное 
            // беззнаковое 64-битное представление.
            let bigIntVal;
            if (typeof part === 'bigint') {
                bigIntVal = part;
            } else {
                bigIntVal = BigInt(Math.trunc(Number(part)));
            }
            
            const unsignedBigInt = bigIntVal < 0n 
                ? (bigIntVal & 0xFFFFFFFFFFFFFFFFn) 
                : bigIntVal;
                
            return unsignedBigInt.toString(16).padStart(16, '0');
        };

        return toHex(this._part1) + 
               toHex(this._part2) + 
               toHex(this._part3) + 
               toHex(this._part4);
    }
}