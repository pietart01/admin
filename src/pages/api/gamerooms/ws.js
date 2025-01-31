// pages/api/gamerooms/ws.js
import { WebSocketServer } from 'ws';

let wss = null;

class GameRoomManager {
    constructor() {
        this.rooms = new Map();
        this.clients = new Set();
    }

    addClient(ws) {
        this.clients.add(ws);
        this.sendRoomList(ws);
    }

    removeClient(ws) {
        this.clients.delete(ws);
    }

    sendRoomList(ws) {
        const roomList = Array.from(this.rooms.values());
        ws.send(JSON.stringify({
            type: 'roomList',
            rooms: roomList
        }));
    }

    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data);

            switch (data.type) {
                case 'createRoom':
                    const room = {
                        id: Date.now().toString(),
                        ...data.roomData,
                        createdAt: new Date().toISOString()
                    };
                    this.rooms.set(room.id, room);
                    this.broadcastToAll({
                        type: 'roomCreated',
                        room
                    });
                    break;

                case 'removeRoom':
                    if (this.rooms.delete(data.roomId)) {
                        this.broadcastToAll({
                            type: 'roomRemoved',
                            roomId: data.roomId
                        });
                    }
                    break;

                case 'requestRoomList':
                    this.sendRoomList(ws);
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process request'
            }));
        }
    }

    broadcastToAll(message) {
        const messageStr = JSON.stringify(message);
        this.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(messageStr);
            }
        });
    }
}

let gameRoomManager = null;

const handler = (req, res) => {
    console.log('Handler called:', req.method);
    console.log('Headers:', req.headers);

    try {
        if (!wss) {
            console.log('Creating new WebSocket server...');
            wss = new WebSocketServer({
                noServer: true,
                path: "/api/gamerooms/ws"
            });
            gameRoomManager = new GameRoomManager();

            wss.on('connection', (ws) => {
                console.log('New client connected');
                gameRoomManager.addClient(ws);

                ws.on('message', (message) => {
                    gameRoomManager.handleMessage(ws, message.toString());
                });

                ws.on('close', () => {
                    console.log('Client disconnected');
                    gameRoomManager.removeClient(ws);
                });

                // Send welcome message
                ws.send(JSON.stringify({
                    type: 'connected',
                    message: 'Connected to game room server'
                }));
            });

            // Handle upgrade
            const server = res.socket.server;
            server._events = server._events || {};

            server._events.upgrade = (req, socket, head) => {
                console.log('Upgrade requested for:', req.url);
                if (req.url === '/api/gamerooms/ws') {
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
            res.status(200).json({ message: 'Game Room WebSocket server running' });
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
