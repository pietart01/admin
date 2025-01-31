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
    }

    // Connection management
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
    }

    // Room operations
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
            return;
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
            return;
            // throw new Error('Must be authenticated to create room');
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
            // throw new Error('Must be authenticated to request room list');
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

    // Event listeners for room updates
    onRoomUpdate(callback) {
        this.roomListeners.add(callback);
        return () => this.roomListeners.delete(callback); // Returns cleanup function
    }

    notifyRoomListeners(action, data) {
        this.roomListeners.forEach(listener => listener({ action, data }));
    }

    // Message handling
    async handleMessage(event) {
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
                    await this.loginPwd(this.credentials.id, this.credentials.password);
                    break;

                case NETMSG_CLIENTLOGINPWD:
                    console.log('Login password successful, selecting channel');
                    await this.selectChannel();
                    console.log('selectChannel');
                    this.isAuthenticated = true;
                    // this.requestRoomList(); // Get initial room list
                    break;

                case NETMSG_ROOMLIST:
                    console.log('Room list received:', dataItems)
                    this.handleRoomList(dataNum, dataItems);
                    break;

                case NETMSG_ROOMCREATE:
                    this.handleRoomCreated(dataItems);
                    break;

                case NETMSG_ROOMREMOVE:
                    this.handleRoomRemoved(dataItems);
                    // this.requestRoomList();
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    // Room event handlers
    handleRoomList(dataNum, dataItems) {
        // Process room list from server
        // Format will depend on your server's implementation
        console.log('Room list received:', dataNum);

        /*
                            room.RoomNo = (int)netdata.Pop();
                    room.RoomId = (int)netdata.Pop();
                    room.Title = (string)netdata.Pop();
                    room.IsProtected = (byte)netdata.Pop() != 0 ? true : false;     //암호길이가 0이 아니면 비밀방이다.
                    room.PlayMode = (int)((byte)netdata.Pop());
                    room.RoomState = (int)((byte)netdata.Pop());
                    room.PingMoney = (int)netdata.Pop();
                    room.MinLimitMoney = (int)((double)netdata.Pop());
                    room.MaxLimitMoney = (int)((double)netdata.Pop());
                    room.UserCount = (int)((byte)netdata.Pop());
                    room.MaxRoomUserLimit = (int)((byte)netdata.Pop());
         */
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
        /*
        for (int i = 0; i < roomcount; i++)
                {
                    MTLobbyRoom room = new MTLobbyRoom();
                    room.RoomNo = (int)netdata.Pop();
                    room.RoomId = (int)netdata.Pop();
                    room.Title = (string)netdata.Pop();
                    room.IsProtected = (byte)netdata.Pop() != 0 ? true : false;     //암호길이가 0이 아니면 비밀방이다.
                    room.PlayMode = (int)((byte)netdata.Pop());
                    room.RoomState = (int)((byte)netdata.Pop());
                    room.PingMoney = (int)netdata.Pop();
                    room.MinLimitMoney = (int)((double)netdata.Pop());
                    room.MaxLimitMoney = (int)((double)netdata.Pop());
                    room.UserCount = (int)((byte)netdata.Pop());
                    Debug.Log(room.RoomId + ":" + room.Title + ":" + room.UserCount);

                    //room.RoomId < 0이면 가라방이다.
                    if (room.RoomId > 0 && room.UserCount < 1)
                        return;

                    GlobalHD.Instance.m_RoomList.Add(room);
                    GlobalHD.Instance.m_RoomListClone.Add(room);
                    GlobalHD.Instance.m_gotRoom = room;
                    rooms.Add(room);
                }
         */
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
        // this.requestRoomList();
        this.notifyRoomListeners('roomRemoved', {roomId : dataItems[0]});
    }

    // Authentication related methods
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

    // Heartbeat
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
