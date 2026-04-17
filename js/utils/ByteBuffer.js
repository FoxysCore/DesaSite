export class ByteBuffer {
    constructor(source) {
        if (typeof source === 'number') {
            // Создание буфера указанной длины
            this.buffer = new ArrayBuffer(source);
            this.view = new DataView(this.buffer);
            this._capacity = source;
        } else if (source instanceof Int8Array) {
            // Использование существующего Int8Array
            this.buffer = source.buffer;
            this.view = new DataView(this.buffer);
            this._capacity = source.length;
        } else if (source instanceof ArrayBuffer) {
            // Использование существующего ArrayBuffer
            this.buffer = source;
            this.view = new DataView(this.buffer);
            this._capacity = source.byteLength;
        } else {
            throw new Error('Invalid constructor argument. Expected number, Int8Array, or ArrayBuffer');
        }
        
        this._position = 0;
        this._limit = this._capacity;
        this._markedPosition = -1;
        this._order = true; // true = big-endian, false = little-endian
    }

    // Статические фабричные методы
    static allocate(capacity) {
        return new ByteBuffer(capacity);
    }

    static wrap(array) {
        return new ByteBuffer(array);
    }

    // Геттеры
    get position() {
        return this._position;
    }

    set position(pos) {
        if (pos < 0 || pos > this._limit) {
            throw new Error('Invalid position');
        }
        this._position = pos;
    }

    get limit() {
        return this._limit;
    }

    set limit(lim) {
        if (lim < 0 || lim > this._capacity) {
            throw new Error('Invalid limit');
        }
        this._limit = lim;
        if (this._position > this._limit) {
            this._position = this._limit;
        }
    }

    get capacity() {
        return this._capacity;
    }

    get remaining() {
        return this._limit - this._position;
    }

    hasRemaining() {
        return this.remaining > 0;
    }

    // Управление порядком байт
    order(order) {
        if (order === undefined) {
            return this._order ? 'BIG_ENDIAN' : 'LITTLE_ENDIAN';
        }
        if (typeof order === 'boolean') {
            this._order = order;
        } else if (typeof order === 'string') {
            this._order = order.toUpperCase() === 'BIG_ENDIAN';
        }
        return this;
    }

    // Методы для работы с позицией
    clear() {
        this._position = 0;
        this._limit = this._capacity;
        this._markedPosition = -1;
        return this;
    }

    flip() {
        this._limit = this._position;
        this._position = 0;
        this._markedPosition = -1;
        return this;
    }

    rewind() {
        this._position = 0;
        this._markedPosition = -1;
        return this;
    }

    mark() {
        this._markedPosition = this._position;
        return this;
    }

    reset() {
        if (this._markedPosition === -1) {
            throw new Error('Mark not set');
        }
        this._position = this._markedPosition;
        return this;
    }

    // Чтение примитивных типов с текущей позиции
    get() {
        if (this._position >= this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this.view.getInt8(this._position);
        this._position += 1;
        return value;
    }

    getByte() {
        return this.get();
    }

    getUByte() {
        if (this._position >= this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this.view.getUint8(this._position);
        this._position += 1;
        return value;
    }

    getShort() {
        if (this._position + 2 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getInt16(this._position)
            : this.view.getInt16(this._position, true);
        this._position += 2;
        return value;
    }

    getUShort() {
        if (this._position + 2 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getUint16(this._position)
            : this.view.getUint16(this._position, true);
        this._position += 2;
        return value;
    }

    getInt() {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getInt32(this._position)
            : this.view.getInt32(this._position, true);
        this._position += 4;
        return value;
    }

    getUInt() {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getUint32(this._position)
            : this.view.getUint32(this._position, true);
        this._position += 4;
        return value;
    }

    getLong() {
        if (this._position + 8 > this._limit) {
            throw new Error('Buffer underflow');
        }
        
        let high, low;
        if (this._order) {
            // Big-endian
            high = this.view.getInt32(this._position);
            low = this.view.getUint32(this._position + 4);
        } else {
            // Little-endian
            low = this.view.getUint32(this._position);
            high = this.view.getInt32(this._position + 4);
        }
        
        const value = high * 0x100000000 + low;
        this._position += 8;
        return value;
    }

    getFloat() {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getFloat32(this._position)
            : this.view.getFloat32(this._position, true);
        this._position += 4;
        return value;
    }

    getDouble() {
        if (this._position + 8 > this._limit) {
            throw new Error('Buffer underflow');
        }
        const value = this._order 
            ? this.view.getFloat64(this._position)
            : this.view.getFloat64(this._position, true);
        this._position += 8;
        return value;
    }

    getByteLengthString(encoding = 'utf-8') {
        if (this._position + 1 > this._limit) {
            throw new Error('Buffer underflow: cannot read string length');
        }
        
        const length = this.getUByte(); // Читаем длину как unsigned byte
        
        if (length === 0) {
            return '';
        }
        
        if (this._position + length > this._limit) {
            throw new Error('Buffer underflow: string data truncated');
        }
        
        // Читаем байты строки
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = this.getUByte();
        }
        
        // Декодируем байты в строку
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    }

    // Чтение строки с длиной в 2 байта (максимальная длина 65535 символов)
    getShortLengthString(encoding = 'utf-8') {
        if (this._position + 2 > this._limit) {
            throw new Error('Buffer underflow: cannot read string length');
        }
        
        const length = this.getUShort(); // Читаем длину как unsigned short
        
        if (length === 0) {
            return '';
        }
        
        if (this._position + length > this._limit) {
            throw new Error('Buffer underflow: string data truncated');
        }
        
        // Читаем байты строки
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = this.getUByte();
        }
        
        // Декодируем байты в строку
        const decoder = new TextDecoder(encoding);
        return decoder.decode(bytes);
    }

    // Чтение по абсолютной позиции
    getByteAt(index) {
        if (index < 0 || index >= this._limit) {
            throw new Error('Index out of bounds');
        }
        return this.view.getInt8(index);
    }

    getUByteAt(index) {
        if (index < 0 || index >= this._limit) {
            throw new Error('Index out of bounds');
        }
        return this.view.getUint8(index);
    }

    getShortAt(index) {
        if (index + 2 > this._limit) {
            throw new Error('Index out of bounds');
        }
        return this._order 
            ? this.view.getInt16(index)
            : this.view.getInt16(index, true);
    }

    getIntAt(index) {
        if (index + 4 > this._limit) {
            throw new Error('Index out of bounds');
        }
        return this._order 
            ? this.view.getInt32(index)
            : this.view.getInt32(index, true);
    }

    getLongAt(index) {
        if (index + 8 > this._limit) {
            throw new Error('Index out of bounds');
        }
        
        let high, low;
        if (this._order) {
            high = this.view.getInt32(index);
            low = this.view.getUint32(index + 4);
        } else {
            low = this.view.getUint32(index);
            high = this.view.getInt32(index + 4);
        }
        
        return high * 0x100000000 + low;
    }

        // Чтение строки с длиной в 1 байт по указанной позиции
    getByteLengthStringAt(index, encoding = 'utf-8') {
        const oldPosition = this._position;
        try {
            this._position = index;
            return this.getByteLengthString(encoding);
        } finally {
            this._position = oldPosition;
        }
    }

    // Чтение строки с длиной в 2 байта по указанной позиции
    getShortLengthStringAt(index, encoding = 'utf-8') {
        const oldPosition = this._position;
        try {
            this._position = index;
            return this.getShortLengthString(encoding);
        } finally {
            this._position = oldPosition;
        }
    }


    // Запись примитивных типов на текущую позицию
    put(value) {
        if (this._position + 1 > this._limit) {
            throw new Error('Buffer overflow');
        }
        this.view.setInt8(this._position, value);
        this._position += 1;
        return this;
    }

    putByte(value) {
        return this.put(value);
    }

    putUByte(value) {
        if (this._position + 1 > this._limit) {
            throw new Error('Buffer overflow');
        }
        this.view.setUint8(this._position, value);
        this._position += 1;
        return this;
    }

    putShort(value) {
        if (this._position + 2 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setInt16(this._position, value);
        } else {
            this.view.setInt16(this._position, value, true);
        }
        this._position += 2;
        return this;
    }

    putUShort(value) {
        if (this._position + 2 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setUint16(this._position, value);
        } else {
            this.view.setUint16(this._position, value, true);
        }
        this._position += 2;
        return this;
    }

    putInt(value) {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setInt32(this._position, value);
        } else {
            this.view.setInt32(this._position, value, true);
        }
        this._position += 4;
        return this;
    }

    putUInt(value) {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setUint32(this._position, value);
        } else {
            this.view.setUint32(this._position, value, true);
        }
        this._position += 4;
        return this;
    }

    putLong(value) {
        if (this._position + 8 > this._limit) {
            throw new Error('Buffer overflow');
        }
        
        const high = Math.floor(value / 0x100000000);
        const low = value >>> 0;
        
        if (this._order) {
            this.view.setInt32(this._position, high);
            this.view.setUint32(this._position + 4, low);
        } else {
            this.view.setUint32(this._position, low);
            this.view.setInt32(this._position + 4, high);
        }
        
        this._position += 8;
        return this;
    }

    putFloat(value) {
        if (this._position + 4 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setFloat32(this._position, value);
        } else {
            this.view.setFloat32(this._position, value, true);
        }
        this._position += 4;
        return this;
    }

    putDouble(value) {
        if (this._position + 8 > this._limit) {
            throw new Error('Buffer overflow');
        }
        if (this._order) {
            this.view.setFloat64(this._position, value);
        } else {
            this.view.setFloat64(this._position, value, true);
        }
        this._position += 8;
        return this;
    }
    putByteLengthString(str, encoding = 'utf-8') {
        // Кодируем строку в байты
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        
        if (bytes.length > 255) {
            throw new Error(`String too long: ${bytes.length} bytes exceeds maximum 255 for byte length prefix`);
        }
        
        // Записываем длину (1 байт)
        this.putUByte(bytes.length);
        
        // Записываем байты строки
        for (let i = 0; i < bytes.length; i++) {
            this.putUByte(bytes[i]);
        }
        
        return this;
    }

    // Запись строки с длиной в 2 байта
    putShortLengthString(str, encoding = 'utf-8') {
        // Кодируем строку в байты
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        
        if (bytes.length > 65535) {
            throw new Error(`String too long: ${bytes.length} bytes exceeds maximum 65535 for short length prefix`);
        }
        
        // Записываем длину (2 байта)
        this.putUShort(bytes.length);
        
        // Записываем байты строки
        for (let i = 0; i < bytes.length; i++) {
            this.putUByte(bytes[i]);
        }
        
        return this;
    }

    // Запись по абсолютной позиции
    putByteAt(index, value) {
        if (index < 0 || index >= this._limit) {
            throw new Error('Index out of bounds');
        }
        this.view.setInt8(index, value);
        return this;
    }

    putUByteAt(index, value) {
        if (index < 0 || index >= this._limit) {
            throw new Error('Index out of bounds');
        }
        this.view.setUint8(index, value);
        return this;
    }

    putShortAt(index, value) {
        if (index + 2 > this._limit) {
            throw new Error('Index out of bounds');
        }
        if (this._order) {
            this.view.setInt16(index, value);
        } else {
            this.view.setInt16(index, value, true);
        }
        return this;
    }

    putIntAt(index, value) {
        if (index + 4 > this._limit) {
            throw new Error('Index out of bounds');
        }
        if (this._order) {
            this.view.setInt32(index, value);
        } else {
            this.view.setInt32(index, value, true);
        }
        return this;
    }


    putByteLengthStringAt(index, str, encoding = 'utf-8') {
        const oldPosition = this._position;
        try {
            this._position = index;
            return this.putByteLengthString(str, encoding);
        } finally {
            this._position = oldPosition;
        }
    }

    // Запись строки с длиной в 2 байта по указанной позиции
    putShortLengthStringAt(index, str, encoding = 'utf-8') {
        const oldPosition = this._position;
        try {
            this._position = index;
            return this.putShortLengthString(str, encoding);
        } finally {
            this._position = oldPosition;
        }
    }


    // Работа с массивом байт
    getBytes(dst, offset, length) {
        if (!dst) {
            // Возвращаем новый массив с оставшимися байтами
            const remaining = this.remaining;
            const array = new Int8Array(remaining);
            for (let i = 0; i < remaining; i++) {
                array[i] = this.get();
            }
            return array;
        }
        
        offset = offset || 0;
        length = length || Math.min(dst.length - offset, this.remaining);
        
        for (let i = 0; i < length; i++) {
            dst[offset + i] = this.get();
        }
        
        return this;
    }

    putBytes(src, offset, length) {
        if (src instanceof Int8Array || src instanceof ArrayBuffer) {
            const array = src instanceof Int8Array ? src : new Int8Array(src);
            offset = offset || 0;
            length = length || array.length - offset;
            
            for (let i = 0; i < length; i++) {
                this.put(array[offset + i]);
            }
        } else if (Array.isArray(src)) {
            offset = offset || 0;
            length = length || src.length - offset;
            
            for (let i = 0; i < length; i++) {
                this.put(src[offset + i]);
            }
        } else {
            throw new Error('Invalid source type');
        }
        
        return this;
    }

    // Преобразование в массив
    toInt8Array() {
        return new Int8Array(this.buffer, 0, this._limit);
    }

    toUint8Array() {
        return new Uint8Array(this.buffer, 0, this._limit);
    }

    toArrayBuffer() {
        return this.buffer.slice(0, this._limit);
    }

    // Дополнительные методы
    slice() {
        const sliced = new ByteBuffer(this.remaining);
        const oldPosition = this._position;
        
        for (let i = 0; i < this.remaining; i++) {
            sliced.put(this.get());
        }
        
        this._position = oldPosition;
        sliced.flip();
        
        return sliced;
    }

    duplicate() {
        const dup = new ByteBuffer(this.buffer);
        dup._position = this._position;
        dup._limit = this._limit;
        dup._order = this._order;
        return dup;
    }

    compact() {
        const remaining = this.remaining;
        for (let i = 0; i < remaining; i++) {
            this.view.setInt8(i, this.view.getInt8(this._position + i));
        }
        this._position = remaining;
        this._limit = this._capacity;
        this._markedPosition = -1;
        return this;
    }
}