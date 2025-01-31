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
        console.log('Setting rooms:', rooms);

        // Remove duplicates keeping only the latest room with same roomId
        const uniqueRooms = rooms.reduce((acc, room) => {
            const existingIndex = acc.findIndex(r => r.roomId === room.roomId);
            if (existingIndex !== -1) {
                // Replace existing room with new one
                acc[existingIndex] = room;
            } else {
                // Add new room
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

        // Check if room already exists
        const existingRoomIndex = this.rooms.findIndex(room => room.roomId === newRoom.roomId);

        if (existingRoomIndex !== -1) {
            // Update existing room
            this.rooms[existingRoomIndex] = newRoom;
        } else {
            // Add new room
            this.rooms.push(newRoom);
        }

        // Broadcast updated room list
        this.broadcastToAll({
            type: 'roomList',
            rooms: this.rooms
        });
        // console.log('handleRoomCreated:', rooms)
        // this.broadcastToAll({
        //     type: 'roomCreated',
        //     room: rooms[0]
        // });
    }

    handleRoomRemoved(data) {
        console.log('handleRoomRemoved:', data);

        // Remove room from the list
        this.rooms = this.rooms.filter(room => room.roomId !== data.roomId);

        // Broadcast updated room list
        this.broadcastToAll({
            type: 'roomList',
            rooms: this.rooms
        });
/*        console.log('handleRoomRemoved:', data);
        this.broadcastToAll({
            type: 'roomRemoved',
            data
        });*/
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
            const gameClient = new GameRoomClient(GAME_SERVER_URL, { id: 'a', password: 'a' });

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
                        console.log('Message from web client111:', data);

                        switch(data.type) {
                            case 'createRoom':
                                console.log('=>Creating room:', data.roomData);
                                await gameClient.createRoom(data.roomData);
                                break;
                            case 'removeRoom':
                                await gameClient.removeRoom(data.roomId);
                                // await gameClient.removeRoom(data.roomId);
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
