import { WebSocketServer } from "./WebSocketServer.js";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/websocket") {
            if (request.headers.get("Upgrade") !== "websocket") {
                return new Response("Expected websocket", { status: 426 });
            }

            const id = env.WEBSOCKET_SERVER.idFromName("main");
            const stub = env.WEBSOCKET_SERVER.get(id);

            return stub.fetch(request);
        }

        return new Response("WebSocket server running. Connect to /websocket.");
    }
};

// 👇 THIS IS REQUIRED
export { WebSocketServer };
