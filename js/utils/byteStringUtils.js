export function getByteLengthStrSize(string, encoding = 'utf-8') {
    const encoder = new TextEncoder(encoding);
    return 1 + encoder.encode(string).byteLength
}

export function getShortLengthStrSize(string, encoding = 'utf-8') {
    return getByteLengthStrSize(string, encoding) + 1;
}