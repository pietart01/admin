// pages/api/ws.js
import { WebSocketServer } from 'ws';
import GameRoomClient from '../../lib/GameRoomClient';  // Import your GameRoomClient

let wss = null;
let gameClient = null;

class ClientManager {
    constructor() {
        this.clients = new Set();
    }

    addClient(ws) {
        console.log('Adding web client');
        this.clients.add(ws);
        // Send current room list if available
        if (this.rooms && this.rooms.length > 0) {
            ws.send(JSON.stringify({
                type: 'roomList',
                rooms: this.rooms
            }));
        }
    }

    removeClient(ws) {
        console.log('Removing web client');
        this.clients.delete(ws);
    }

    broadcastToAll(message) {
        const messageStr = JSON.stringify(message);
        this.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(messageStr);
            }
        });
    }

    setRooms(rooms) {
        console.log('Setting rooms:', rooms)
        this.rooms = rooms;
        this.broadcastToAll({
            type: 'roomList',
            rooms: rooms
        });
    }

    handleRoomCreated(room) {
        this.broadcastToAll({
            type: 'roomCreated',
            room
        });
    }

    handleRoomRemoved(roomId) {
        this.broadcastToAll({
            type: 'roomRemoved',
            roomId
        });
    }
}

let clientManager = null;

const handler = (req, res) => {
    console.log('Handler called with method:', req.method);

    try {
        if (!wss) {
            console.log('Initializing WebSocket server and GameRoomClient');

            // Initialize WebSocket server
            wss = new WebSocketServer({ noServer: true });
            clientManager = new ClientManager();

            // Initialize GameRoomClient
            const GAME_SERVER_URL = 'ws://178.128.17.145:4000';
            gameClient = new GameRoomClient(GAME_SERVER_URL);

            // Connect to game server and set up listeners
            gameClient.connect().then(() => {
                console.log('Connected to game server');

                // Set up room update listener on game client
                gameClient.onRoomUpdate(({ action, data }) => {
                    console.log('Room update from game server:', action, data);
                    switch(action) {
                        case 'roomList':
                            clientManager.setRooms(data);
                            break;
                        case 'roomCreated':
                            clientManager.handleRoomCreated(data);
                            break;
                        case 'roomRemoved':
                            clientManager.handleRoomRemoved(data);
                            break;
                    }
                });
            });

            // Handle web client connections
            wss.on('connection', (ws) => {
                console.log('Web client connected');
                clientManager.addClient(ws);

                ws.on('message', async (message) => {
                    try {
                        const data = JSON.parse(message);
                        console.log('Message from web client:', data);

                        switch(data.type) {
                            case 'createRoom':
                                await gameClient.createRoom(data.roomData);
                                break;
                            case 'removeRoom':
                                await gameClient.removeRoom(data.roomId);
                                break;
                            case 'requestRoomList':
                                await gameClient.requestRoomList();
                                break;
                        }
                    } catch (error) {
                        console.error('Error handling message:', error);
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: error.message
                        }));
                    }
                });

                ws.on('close', () => {
                    console.log('Web client disconnected');
                    clientManager.removeClient(ws);
                });
            });

            // Set up upgrade handler
            const server = res.socket.server;
            server._events = server._events || {};

            server._events.upgrade = (req, socket, head) => {
                wss.handleUpgrade(req, socket, head, (ws) => {
                    wss.emit('connection', ws, req);
                });
            };
        }

        if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
            res.end();
        } else {
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
