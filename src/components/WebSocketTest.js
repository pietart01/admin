// components/WebSocketTest.jsx
import { useEffect, useState, useCallback } from 'react';

export default function WebSocketTest() {
    const [status, setStatus] = useState('Initializing...');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    const connect = useCallback(() => {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/api/gamerooms/ws`;

            console.log('Connecting to WebSocket:', wsUrl);
            setStatus('Connecting...');

            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log('WebSocket connection established');
                setStatus('Connected');
                socket.send(JSON.stringify({ type: 'greeting', message: 'Hello Server!' }));
            };

            socket.onclose = (event) => {
                console.log('WebSocket closed:', event);
                setStatus(`Disconnected (${event.code})`);
                setWs(null);

                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    connect();
                }, 5000);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setStatus('Error: Connection failed');
            };

            socket.onmessage = (event) => {
                console.log('Message received:', event.data);
                try {
                    const message = JSON.parse(event.data);
                    setMessages(prev => [...prev, message]);
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            };

            setWs(socket);
        } catch (err) {
            console.error('Connection error:', err);
            setStatus(`Error: ${err.message}`);
        }
    }, []);

    useEffect(() => {
        connect();
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [connect]);

    const sendTestMessage = useCallback(() => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'test', message: 'Test message' }));
        } else {
            console.log('WebSocket is not connected');
        }
    }, [ws]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">WebSocket Test</h2>
            <div className="mb-4">
                <div><strong>Status:</strong> {status}</div>
                <button
                    onClick={sendTestMessage}
                    disabled={!ws || ws.readyState !== WebSocket.OPEN}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Send Test Message
                </button>
            </div>
            <div>
                <h3 className="font-bold">Messages:</h3>
                <pre className="bg-gray-100 p-2 mt-2 rounded">
                    {JSON.stringify(messages, null, 2)}
                </pre>
            </div>
        </div>
    );
}
