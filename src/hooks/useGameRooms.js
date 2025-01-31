// hooks/useGameRooms.js
import { useEffect, useState, useCallback } from 'react';

export function useGameRooms() {
    const [status, setStatus] = useState('Disconnected');
    const [rooms, setRooms] = useState([]);
    const [ws, setWs] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/ws')
            .then(res => res.json())
            .then(data => {
                console.log('HTTP test successful:', data);
                initWebSocket();
            })
            .catch(err => {
                console.error('HTTP test failed:', err);
                setError('HTTP test failed: ' + err.message);
            });


        function initWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/api/ws`;

            console.log('Connecting to:', wsUrl);
            const websocket = new WebSocket(wsUrl);

            websocket.onopen = () => {
                console.log('Connected to game server');
                setStatus('Connected');
                setError(null);
                websocket.send(JSON.stringify({type: 'requestRoomList'}));
            };

            websocket.onclose = (event) => {
                console.log('Disconnected from game server:', event);
                setStatus('Disconnected');
                setWs(null);
            };

            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('Connection error occurred');
            };

            websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Received:', data);

                    switch (data.type) {
                        case 'roomList':
                            setRooms(data.rooms);
                            break;

                        case 'roomCreated':
                            setRooms(prevRooms => {
                                // Check if room with same roomId already exists
                                const roomExists = prevRooms.some(room => room.roomId === data.room.roomId);

                                // Only add the room if it doesn't exist
                                return roomExists ? prevRooms : [...prevRooms, data.room];
                            });
                            break;

                        case 'roomRemoved':
                            setRooms(prevRooms =>
                                prevRooms.filter(room => room.id !== data.roomId)
                            );
                            break;

                        case 'error':
                            setError(data.message);
                            break;
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            setWs(websocket);

            return () => {
                websocket.close();
            };
        }
    }, []);

    const createRoom = useCallback((roomData) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'createRoom',
                roomData: {
                    roomName: roomData.roomName || `Room ${Date.now()}`,
                    maxPlayers: roomData.maxPlayers || 6,
                    password: roomData.password || '',
                    bingMoney: roomData.bingMoney || 1000,
                    enterMoney: roomData.enterMoney || 1000,
                    minMoney: roomData.minMoney || 1000,
                    maxMoney: roomData.maxMoney || 1000,
                    gameMode: roomData.gameMode || 0
                }
            }));
        } else {
            setError('Not connected to server');
        }
    }, [ws]);

    const removeRoom = useCallback((roomId) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'removeRoom',
                roomId
            }));
        }
    }, [ws]);

    const requestRoomList = useCallback(() => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'requestRoomList' }));
        }
    }, [ws]);

    return {
        status,
        rooms,
        error,
        createRoom,
        removeRoom,
        requestRoomList,
        isConnected: status === 'Connected'
    };
}
