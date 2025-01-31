// hooks/useGameRooms.js
import { useEffect, useRef, useState } from 'react';

export function useGameRooms() {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        let ws = null;

        try {
            console.log('Attempting to connect...');
            ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/gamerooms/ws`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected successfully');
                setIsConnected(true);
                setError(null);

                // Send a test message
                ws.send(JSON.stringify({ type: 'test', message: 'Hello server!' }));
            };

            ws.onclose = (event) => {
                console.log('Connection closed:', event);
                setIsConnected(false);
                setError(`Connection closed (${event.code})`);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('Connection error occurred');
            };

            ws.onmessage = (event) => {
                console.log('Received message:', event.data);
            };
        } catch (err) {
            console.error('Setup error:', err);
            setError(err.message);
        }

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const sendTestMessage = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'test', message: 'Test message' }));
        } else {
            setError('Not connected');
        }
    };

    return {
        isConnected,
        error,
        sendTestMessage
    };
}
