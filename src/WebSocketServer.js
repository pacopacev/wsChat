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

        // ws.send(`[DO] Echo: ${message}, from: ${conn.id}, total: ${this.sessions.size}`);
        ws.send(`[DO] Echo: ${message}, from: ${conn.id}, total: ${this.sessions.size}`);

        this.sessions.forEach((_, session) => {
            if (session !== ws) {
                session.send(`[DO] Broadcast: ${message}, from: ${conn.id}`);
            }
        });
    }
}
