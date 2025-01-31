// GameRoomClient.js
const WebSocket = require('ws');
const {
    SIGNATURE,
    TYPE_CODES,
    createPacket,
    parsePacket,
    NETMSG_HEARTBEAT,
    NETMSG_CLIENTLOGINID,
    NETMSG_CLIENTLOGINPWD,
    NETMSG_SELECTCHANNEL,
    NETMSG_ROOMLIST,
    NETMSG_ROOMCREATE,
    NETMSG_ROOMREMOVE
} = require('./packetUtils');

class GameRoomClient {
    constructor(url, credentials = { id: 'a', password: 'a' }) {
        this.url = url;
        this.credentials = credentials;
        this.ws = null;
        this.sendPacketId = 0;
        this.lastRecvPacketId = 0;
        this.heartbeatInterval = null;
        this.isAuthenticated = false;
        this.roomListeners = new Set();
        this.rooms = new Map();
        this.onDisconnect = null; // New callback for disconnect handling
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.url);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onopen = async () => {
                console.log('Connected to server');
                this.startHeartbeat();
                try {
                    await this.authenticate();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            this.ws.onclose = () => {
                console.log('Disconnected from server');
                this.cleanup();
                if (this.onDisconnect) {
                    this.onDisconnect();
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.ws.onmessage = (event) => this.handleMessage(event);
        });
    }

    async authenticate() {
        // Step 1: Login with ID
        await this.loginID(this.credentials.id, '127.0.0.1', 'AA:BB:CC:DD:EE:FF', 0);
        // Step 2: Login with password happens in message handler
        // Step 3: Select channel happens in message handler
    }

    cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        this.isAuthenticated = false;
        this.rooms.clear();
        this.sendPacketId = 0;
        this.lastRecvPacketId = 0;
    }

    // Rest of the GameRoomClient implementation remains the same...
    // [Previous methods for room operations, message handling, etc.]

    createRoom({
                   roomName,
                   password = '',
                   bingMoney = 1000,
                   enterMoney = 1000,
                   minMoney = 1000,
                   maxMoney = 1000,
                   gameMode = 0,
                   maxPlayers = 6
               }) {
        if (!this.isAuthenticated) {
            throw new Error('Must be authenticated to create room');
        }

        const dataItems = [
            { type: TYPE_CODES.STRING, value: roomName },
            { type: TYPE_CODES.STRING, value: password },
            { type: TYPE_CODES.INT32, value: bingMoney },
            { type: TYPE_CODES.DOUBLE, value: enterMoney },
            { type: TYPE_CODES.DOUBLE, value: minMoney },
            { type: TYPE_CODES.DOUBLE, value: maxMoney },
            { type: TYPE_CODES.BYTE, value: gameMode },
            { type: TYPE_CODES.BYTE, value: maxPlayers },
            { type: TYPE_CODES.INT32, value: 1 },
        ];

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_ROOMCREATE,
            dataItems
        );

        this.ws.send(buffer);
    }

    removeRoom(roomId) {
        if (!this.isAuthenticated) {
            throw new Error('Must be authenticated to remove room');
        }

        const dataItems = [
            { type: TYPE_CODES.INT32, value: roomId },
        ];

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_ROOMREMOVE,
            dataItems
        );

        this.ws.send(buffer);
    }

    requestRoomList() {
        if (!this.isAuthenticated) {
            return;
        }

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_ROOMLIST,
            []
        );

        this.ws.send(buffer);
    }

    onRoomUpdate(callback) {
        this.roomListeners.add(callback);
        return () => this.roomListeners.delete(callback);
    }

    notifyRoomListeners(action, data) {
        this.roomListeners.forEach(listener => listener({ action, data }));
    }

    handleMessage(event) {
        try {
            const packet = parsePacket(event.data);
            const {
                sendPacketId,
                lastRecvPacketId,
                msgCode,
                dataNum,
                dataItems,
            } = packet;

            this.lastRecvPacketId = sendPacketId;

            switch (msgCode) {
                case NETMSG_CLIENTLOGINID:
                    console.log('Login ID successful, sending password');
                    this.loginPwd(this.credentials.id, this.credentials.password);
                    break;

                case NETMSG_CLIENTLOGINPWD:
                    console.log('Login password successful, selecting channel');
                    this.selectChannel();
                    this.isAuthenticated = true;
                    break;

                case NETMSG_ROOMLIST:
                    console.log('Room list received:', dataItems);
                    this.handleRoomList(dataNum, dataItems);
                    break;

                case NETMSG_ROOMCREATE:
                    this.handleRoomCreated(dataItems);
                    break;

                case NETMSG_ROOMREMOVE:
                    this.handleRoomRemoved(dataItems);
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    handleRoomList(dataNum, dataItems) {
        let roomList = [];
        let roomCount = dataItems[0];
        for (let i = 0; i < roomCount; i++) {
            if(!dataItems[i * 8 + 1] || !dataItems[i * 8 + 2]) {
                return;
            }
            roomList.push({
                roomNo: dataItems[i * 8 + 1],
                roomId: dataItems[i * 8 + 2],
                title: dataItems[i * 8 + 3],
                isProtected: dataItems[i * 8 + 4] !== 0,
                playMode: dataItems[i * 8 + 5],
                roomState: dataItems[i * 8 + 6],
                pingMoney: dataItems[i * 8 + 7],
                minLimitMoney: dataItems[i * 8 + 8],
                maxLimitMoney: dataItems[i * 8 + 9],
                userCount: dataItems[i * 8 + 10],
                maxRoomUserLimit: dataItems[i * 8 + 11],
            });
        }
        this.notifyRoomListeners('roomList', roomList);
    }

    handleRoomCreated(dataItems) {
        console.log('Room created:', dataItems);
        let roomList = [];
        let roomCount = dataItems[0];
        for (let i = 0; i < roomCount; i++) {
            if(!dataItems[i * 8 + 1] || !dataItems[i * 8 + 2]) {
                return;
            }
            roomList.push({
                roomNo: dataItems[i * 8 + 1],
                roomId: dataItems[i * 8 + 2],
                title: dataItems[i * 8 + 3],
                isProtected: dataItems[i * 8 + 4] !== 0,
                playMode: dataItems[i * 8 + 5],
                roomState: dataItems[i * 8 + 6],
                pingMoney: dataItems[i * 8 + 7],
                minLimitMoney: dataItems[i * 8 + 8],
                maxLimitMoney: dataItems[i * 8 + 9],
                userCount: dataItems[i * 8 + 10],
                maxRoomUserLimit: dataItems[i * 8 + 11],
            });
        }

        this.notifyRoomListeners('roomCreated', roomList);
    }

    handleRoomRemoved(dataItems) {
        console.log('Room removed:', dataItems);
        this.notifyRoomListeners('roomRemoved', {roomId: dataItems[0]});
    }

    async loginID(id, ipAddress, macAddress, userOption) {
        const dataItems = [
            { type: TYPE_CODES.STRING, value: id },
            { type: TYPE_CODES.BYTE, value: userOption },
            { type: TYPE_CODES.STRING, value: ipAddress },
            { type: TYPE_CODES.STRING, value: macAddress },
        ];

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_CLIENTLOGINID,
            dataItems
        );

        this.ws.send(buffer);
    }

    async loginPwd(id, password) {
        const dataItems = [
            { type: TYPE_CODES.STRING, value: id },
            { type: TYPE_CODES.STRING, value: password },
        ];

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_CLIENTLOGINPWD,
            dataItems
        );

        this.ws.send(buffer);
    }

    async selectChannel(channelId = 1) {
        const dataItems = [
            { type: TYPE_CODES.INT32, value: channelId }
        ];

        const buffer = createPacket(
            SIGNATURE,
            this.sendPacketId++,
            this.lastRecvPacketId,
            NETMSG_SELECTCHANNEL,
            dataItems
        );

        this.ws.send(buffer);
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const buffer = createPacket(
                    SIGNATURE,
                    this.sendPacketId++,
                    this.lastRecvPacketId,
                    NETMSG_HEARTBEAT,
                    []
                );
                this.ws.send(buffer);
            }
        }, 10000);
    }
}

module.exports = GameRoomClient;
