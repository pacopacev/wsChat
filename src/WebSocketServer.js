export class WebSocketServer {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Map();
    }

    async fetch(request) {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        server.accept();

        const id = crypto.randomUUID();
        this.sessions.set(server, { id });

        server.addEventListener("message", (event) => {
            this.handleMessage(server, event.data);
        });

        server.addEventListener("close", () => {
            this.sessions.delete(server);
        });

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    handleMessage(ws, message) {
        const conn = this.sessions.get(ws);

        const msgObj = JSON.parse(message);
        const time = new Date(msgObj.timestamp).toLocaleTimeString("bg", { timeZone: "Europe/Sofia" });
        // console.log(`[${time}] Received message from ${conn.id}:`, msgObj);
// sender
        // ws.send(`[DO] Echo: ${message}, from: ${conn.id}, total: ${this.sessions.size}`);
        ws.send(`${msgObj.username} wrote: ${msgObj.content} at ${time}`);
// receiver
        this.sessions.forEach((_, session) => {
            if (session !== ws) {
                session.send(`${msgObj.username}: ${msgObj.content} at ${time}`);
            }
        });
    }
}
