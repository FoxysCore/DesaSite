export function b64Decode(base64) {
    // Декодируем base64 в бинарную строку
    const binaryString = atob(base64);
    // Преобразуем в Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    // Декодируем как UTF-8
    return new TextDecoder().decode(bytes);
}



export function b64Encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode('0x' + p1)
    ));
}