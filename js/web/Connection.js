import {ConnectionState} from "./ConnectionState.js";

export class Connection {
    #address;
    #guild;
    #state = ConnectionState.DISCONNECTED;
    #socket = null;

    constructor(guild, address) {
        this.#guild = guild;
        this.#address = address;
    }


    connect(useSsl = true) {
        let protocol = useSsl ? "wss" : "ws";
        let uri = `${protocol}://${this.#address}`;
        console.log(`Connecting to ${uri}...`);
        this.#socket = new WebSocket(uri);

        this.#socket.onopen = () => {
            console.log("WebSocket connection opened");
            this.#setState(ConnectionState.CONNECTED);
        };

        this.#socket.onmessage = (event) => {
            console.log("\n".repeat(5) + "#".repeat(30));
            console.log("size:", new TextEncoder().encode(event.data).length, "bytes");
            console.log("Received message:", event.data);
            const data = JSON.parse(event.data);
            console.log("decoded:", data);
            if (data.type == 'AUTH_SUCCESS') {this.#setState(ConnectionState.AUTHENTICATED);}
            this.#guild.getPackageRouter().routePackage(data);
        }

        this.#socket.onclose = () => {
            console.log("WebSocket connection closed");
            this.#setState(ConnectionState.DISCONNECTED);
        }

        this.#socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.#setState(ConnectionState.DISCONNECTED);
        }
    }

    disconnect() {
        if (this.#socket) {
            this.#socket.close();
            this.#socket = null;
        }
    }


    sendPackage(pkg) {
        if (this.#state === ConnectionState.DISCONNECTED) {
            console.error("Cannot send package: not connected");
            return;
        }
        let json = JSON.stringify(pkg);
        this.#socket.send(json);
    }


    getState() {return this.#state;}

    getAddress() {return this.#address;}

    #setState(state) {
        this.#state = state;
        this.#guild.getGuildManager().getCore().getRenderer().getGuildListRenderer().setGuildConnectionState(this.#guild.getId(), state);
    }
}