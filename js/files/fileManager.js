import { Hash } from "../utils/Hash.js";

export class FileManager {
    #core;

    #renderedFiles = new Map();
    #filesQueue = new Map();

    constructor(core) {
        this.#core = core
    }

    async addFile(file) {
        const hash = await getFileSHA256(file);
        this.#renderedFiles.set(hash, file);
    }

    getRenderedFiles() {
        return this.#renderedFiles;
    }

    onMessageSend() {
        for (const hash of this.#renderedFiles.keys()) {
            this.#filesQueue.set(hash, this.#renderedFiles.get(hash));
        }
        this.#renderedFiles.clear();
    }

    getQueuedFile(hash) {
        const file = this.#filesQueue.get(hash);
        this.#filesQueue.delete(hash);
        return file;
    }
}




async function getFileSHA256(file) {
    
    if (!file) {return null;}
    if (file.size > 4*1024*1024*1024) {return null;}
    
    try {
        return Array.from(
            new Uint8Array(
                await crypto.subtle.digest(
                    'SHA-256', 
                    await file.arrayBuffer()
                )
            )
        ).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {

        console.log("using scnd hash algorythm: ", e);

        const hasher = await hashwasm.createSHA256();
        hasher.init();

        const CHUNK_SIZE = 64 * 1024 * 1024;
        
        let offset = 0;

        while (offset < file.size) {
            const chunk = file.slice(offset, offset + CHUNK_SIZE);
            const buffer = await chunk.arrayBuffer(); 
            hasher.update(new Uint8Array(buffer));
            
            offset += chunk.size;
        }

        return hasher.digest('hex'); 
    }
}
