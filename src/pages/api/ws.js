// pages/api/ws.js
import { WebSocketServer } from 'ws';
import GameRoomClient from '../../lib/GameRoomClient';

let wss = null;
let gameClient = null;

class ClientManager {
    constructor() {
        this.clients = new Set();
        this.rooms = [];
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
        console.log('Setting rooms:', rooms);
        const uniqueRooms = rooms.reduce((acc, room) => {
            const existingIndex = acc.findIndex(r => r.roomId === room.roomId);
            if (existingIndex !== -1) {
                acc[existingIndex] = room;
            } else {
                acc.push(room);
            }
            return acc;
        }, []);

        this.rooms = uniqueRooms;
        this.broadcastToAll({
            type: 'roomList',
            rooms: this.rooms
        });
    }

    handleRoomCreated(newRooms) {
        console.log('handleRoomCreated:', newRooms);
        const newRoom = newRooms[0];
        const existingRoomIndex = this.rooms.findIndex(room => room.roomId === newRoom.roomId);

        if (existingRoomIndex !== -1) {
            this.rooms[existingRoomIndex] = newRoom;
        } else {
            this.rooms.push(newRoom);
        }

        this.broadcastToAll({
            type: 'roomList',
            rooms: this.rooms
        });
    }

    handleRoomRemoved(data) {
        console.log('handleRoomRemoved:', data);
        this.rooms = this.rooms.filter(room => room.roomId !== data.roomId);
        this.broadcastToAll({
            type: 'roomList',
            rooms: this.rooms
        });
    }
}

class GameClientManager {
    constructor(url, credentials, clientManager) {
        this.url = url;
        this.credentials = credentials;
        this.clientManager = clientManager;
        this.gameClient = null;
        this.reconnectTimeout = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.baseReconnectDelay = 5000; // 5 seconds
    }

    async initialize() {
        await this.connect();
    }

    async connect() {
        try {
            this.gameClient = new GameRoomClient(this.url, this.credentials);

            // Set up room update listener before connecting
            this.gameClient.onRoomUpdate(({ action, data }) => {
                console.log('Room update from game server:', action, data);
                switch(action) {
                    case 'roomList':
                        this.clientManager.setRooms(data);
                        break;
                    case 'roomCreated':
                        this.clientManager.handleRoomCreated(data);
                        break;
                    case 'roomRemoved':
                        this.clientManager.handleRoomRemoved(data);
                        break;
                }
            });

            // Set up disconnect handler
            this.gameClient.onDisconnect = () => {
                console.log('Game client disconnected, attempting reconnection...');
                this.handleDisconnect();
            };

            await this.gameClient.connect();
            console.log('Connected to game server');
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection

        } catch (error) {
            console.error('Error connecting to game server:', error);
            this.handleDisconnect();
        }
    }

    handleDisconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = this.calculateReconnectDelay();
            console.log(`Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

            this.reconnectTimeout = setTimeout(async () => {
                this.reconnectAttempts++;
                await this.connect();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
            // You might want to notify clients here
            this.clientManager.broadcastToAll({
                type: 'error',
                message: 'Unable to connect to game server after multiple attempts'
            });
        }
    }

    calculateReconnectDelay() {
        // Exponential backoff with jitter
        const baseDelay = this.baseReconnectDelay;
        const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts);
        const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
        return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
    }

    getGameClient() {
        return this.gameClient;
    }
}

let clientManager = null;
let gameClientManager = null;

const handler = (req, res) => {
    console.log('Handler called with method:', req.method);

    try {
        if (!wss) {
            console.log('Initializing WebSocket server and GameRoomClient');

            // Initialize WebSocket server
            wss = new WebSocketServer({ noServer: true });
            clientManager = new ClientManager();

            // Initialize GameClientManager
            const GAME_SERVER_URL = 'ws://178.128.17.145:4000';
            gameClientManager = new GameClientManager(
                GAME_SERVER_URL,
                { id: 'a', password: 'a' },
                clientManager
            );
            gameClientManager.initialize();

            // Handle web client connections
            wss.on('connection', (ws) => {
                console.log('Web client connected');
                clientManager.addClient(ws);

                ws.on('message', async (message) => {
                    try {
                        const data = JSON.parse(message);
                        console.log('Message from web client:', data);

                        const gameClient = gameClientManager.getGameClient();
                        if (!gameClient) {
                            throw new Error('Game client not connected');
                        }

                        switch(data.type) {
                            case 'createRoom':
                                console.log('=>Creating room:', data.roomData);
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
