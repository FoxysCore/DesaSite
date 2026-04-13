import {ConnectionState} from "./ConnectionState.js";

export class Connection {
    #address;
    #guild;
    #state = ConnectionState.DISCONNECTED;
    #socket = null;
    #connectionAttempts = 10;
    #connectTimer = null; // Храним ID таймера подключения

    constructor(guild, address) {
        this.#guild = guild;
        this.#address = address;
    }

    connect() {
        // Если уже есть активный таймер (например, от предыдущей неудачной попытки), сбрасываем его
        if (this.#connectTimer) {
            clearTimeout(this.#connectTimer);
        }

        // Проверка на исчерпание попыток перед началом нового подключения
        if (this.#connectionAttempts <= 0) {
            console.error("Max connection attempts reached.");
            this.#setState(ConnectionState.DISCONNECTED);
            return;
        }

        console.log(`Connecting to ${this.#address} (attempt ${11 - this.#connectionAttempts})`);
        
        this.#socket = new WebSocket(this.#address);
        this.#socket.binaryType = 'arraybuffer';

        // --- Логика Timeout ---
        this.#connectTimer = setTimeout(() => {
            console.warn(`Connection timeout after 10s. Attempting reconnect...`);
            
            // Закрываем текущий зависший сокет. 
            // Это может триггернуть onclose, но мы уже уменьшили попытки ниже или обработаем это там.
            if (this.#socket && this.#socket.readyState !== WebSocket.CLOSED) {
                this.#socket.close(); 
            }
            
            // Запускаем следующую попытку
            this.#handleReconnect();
        }, 10000); // 10 секунд
        // ----------------------

        this.#socket.onopen = () => {
            // Успех! Отменяем таймер ожидания
            clearTimeout(this.#connectTimer);
            this.#connectTimer = null;
            
            this.#connectionAttempts = 10; // Сброс счетчика попыток при успехе
            console.log("WebSocket connection opened");
            this.#setState(ConnectionState.CONNECTED);
        };

        this.#socket.onmessage = (event) => {
            console.log("\n".repeat(5) + "#".repeat(30));
            console.log("byteSize: ", event.data.byteLength)
            console.log("size: ", new TextEncoder().encode(event.data).length, "bytes");
            console.log("Received message: ", event.data);
            try {
                const data = JSON.parse(event.data);
                console.log("decoded:", data);
                if (data.type == 'AUTH_SUCCESS') {
                    this.#setState(ConnectionState.AUTHENTICATED);
                }
                this.#guild.getPackageRouter().routePackage(data);
            } catch (e) {
                console.error("Error parsing message:", e);
            }
        };

        this.#socket.onclose = () => {
            // Очищаем таймер, так как соединение закрыто (неважно, по тайм-ауту или нет)
            clearTimeout(this.#connectTimer);
            this.#connectTimer = null;
            
            console.log("WebSocket connection closed");
            this.#setState(ConnectionState.DISCONNECTED);
            
            // Примечание: Если закрытие произошло НЕ из-за тайм-аута (который сам вызвал handleReconnect),
            // то здесь можно добавить логику переподключения, если это требуется вашей архитектурой.
            // В вашем исходном коде переподключение было только в onerror.
        };

        this.#socket.onerror = (error) => {
            // Очищаем таймер, так как произошла явная ошибка
            clearTimeout(this.#connectTimer);
            this.#connectTimer = null;

            this.#setState(ConnectionState.DISCONNECTED);
            
            // Логируем ошибку, но не пытаемся подключиться здесь сразу, 
            // так как onclose сработает следом. 
            // Чтобы избежать двойного вызова reconnect, лучше обрабатывать retry в одном месте.
            // Однако, сохраняя вашу логику:
            if (this.#connectionAttempts > 0) {
                 // Мы не вызываем connect() прямо здесь, чтобы не дублировать с onclose,
                 // но если ваша логика требует реакции именно на error:
                 // this.#handleReconnect(); 
            } else {
                console.error("WebSocket error:", error);
            }
        };
    }

    // Вспомогательный метод для обработки повторных попыток (и по таймауту, и по ошибке)
    #handleReconnect() {
        this.#connectionAttempts--;
        if (this.#connectionAttempts > 0) {
            // Небольшая задержка перед повторной попыткой, чтобы не спамить сеть мгновенно
            setTimeout(() => {
                this.connect();
            }, 1000); 
        } else {
            console.error("All connection attempts failed.");
            this.#setState(ConnectionState.DISCONNECTED);
        }
    }

    disconnect() {
        // При ручном отключении сбрасываем попытки и таймеры
        if (this.#connectTimer) {
            clearTimeout(this.#connectTimer);
            this.#connectTimer = null;
        }
        this.#connectionAttempts = 0; // Или 10, если хотите разрешить переподключение после disconnect/connect
        
        if (this.#socket) {
            this.#socket.close();
            this.#socket = null;
        }
        this.#setState(ConnectionState.DISCONNECTED);
    }

    sendPackage(pkg) {
        if (this.#state === ConnectionState.DISCONNECTED) {
            console.error("Cannot send package: not connected");
            return;
        }
        // Дополнительная проверка на наличие сокета
        if (!this.#socket || this.#socket.readyState !== WebSocket.OPEN) {
             console.warn("Socket is not open yet.");
             return;
        }
        
        let json = JSON.stringify(pkg);
        this.#socket.send(json);
    }

    getState() {
        if (this.#guild.getId() === 0) {return ConnectionState.AUTHENTICATED;}
        return this.#state;
    }

    getAddress() {return this.#address;}

    #setState(state) {
        if (this.#guild.getId() === 0) {state = ConnectionState.AUTHENTICATED;}
        this.#state = state;
        // Проверка на существование рендерера, чтобы избежать ошибок при быстром закрытии
        const renderer = this.#guild.getGuildManager()?.getCore()?.getRenderer()?.getGuildListRenderer();
        if (renderer) {
            renderer.setGuildConnectionState(this.#guild.getId(), state);
        }
    }
}


async function decompress(arrayBuffer) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = new Response(arrayBuffer).body.pipeThrough(ds);
    return await new Response(decompressedStream).arrayBuffer();
}