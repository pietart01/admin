// pages/api/ws.js
import { WebSocketServer } from 'ws';

let wss = null;

const handler = (req, res) => {
    console.log('Handler called with method:', req.method);
    console.log('Headers:', req.headers);

    try {
        if (!wss) {
            console.log('Creating new WebSocket server...');
            wss = new WebSocketServer({
                noServer: true,
                path: "/api/ws"
            });

            wss.on('connection', (ws) => {
                console.log('New client connected');
                ws.send('Connected!');
            });

            wss.on('error', (error) => {
                console.error('WebSocket server error:', error);
            });

            // Handle upgrade
            const server = res.socket.server;
            server._events = server._events || {};

            server._events.upgrade = (req, socket, head) => {
                console.log('Upgrade requested for:', req.url);
                if (req.url === '/api/ws') {
                    wss.handleUpgrade(req, socket, head, (ws) => {
                        console.log('Upgrade successful');
                        wss.emit('connection', ws, req);
                    });
                }
            };

            console.log('WebSocket server setup complete');
        }

        if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
            console.log('WebSocket upgrade request detected');
            res.end();
        } else {
            console.log('Non-WebSocket request, sending OK');
            res.status(200).json({ message: 'WebSocket server running' });
        }
    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({ error: error.message });
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: false,
    },
};
