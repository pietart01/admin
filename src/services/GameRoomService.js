// services/GameRoomService.js

const GameRoomClient = require("../lib/GameRoomClient");

class GameRoomService {
    constructor() {
        this.gameClient = null;
        this.wsClients = new Set();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        const WEBSOCKET_URL = process.env.GAME_SERVER_URL || 'ws://178.128.17.145:4000';
        this.gameClient = new GameRoomClient(WEBSOCKET_URL);

        try {
            await this.gameClient.connect();

            // Set up room update listener
            this.gameClient.onRoomUpdate(({ action, data }) => {
                this.broadcastToClients({
                    type: 'roomUpdate',
                    action,
                    data
                });
            });

            this.isInitialized = true;
            console.log('GameRoomService initialized successfully');
        } catch (error) {
            console.error('Failed to initialize GameRoomService:', error);
            throw error;
        }
    }

    addClient(ws) {
        this.wsClients.add(ws);

        // Send current room list to new client
        this.gameClient.requestRoomList();

        // Set up message handling for this client
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                await this.handleClientMessage(ws, data);
            } catch (error) {
                console.error('Error handling client message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to process request'
                }));
            }
        });

        ws.on('close', () => {
            this.wsClients.delete(ws);
        });
    }

    async handleClientMessage(ws, message) {
        switch (message.type) {
            case 'createRoom':
                await this.gameClient.createRoom(message.data);
                break;

            case 'requestRoomList':
                await this.gameClient.requestRoomList();
                break;

            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Unknown message type'
                }));
        }
    }

    broadcastToClients(message) {
        const messageStr = JSON.stringify(message);
        this.wsClients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(messageStr);
            }
        });
    }
}

// Create a singleton instance
const gameRoomService = new GameRoomService();
export default gameRoomService;
