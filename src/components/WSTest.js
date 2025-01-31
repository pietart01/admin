// pages/ws-test.js
import { useEffect, useState } from 'react';

export default function WSTest() {
    const [status, setStatus] = useState('Not connected');
    const [error, setError] = useState(null);

    useEffect(() => {
        // First test that we can reach the endpoint with HTTP
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
            try {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${window.location.host}/api/ws`;

                console.log('Attempting WebSocket connection to:', wsUrl);
                setStatus('Connecting...');

                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log('WebSocket connected!');
                    setStatus('Connected');
                    setError(null);
                };

                ws.onclose = (event) => {
                    console.log('WebSocket closed:', event);
                    setStatus(`Closed (code: ${event.code})`);
                };

                ws.onerror = (event) => {
                    console.error('WebSocket error:', event);
                    setStatus('Error occurred');
                    setError('WebSocket error occurred');
                };

                ws.onmessage = (event) => {
                    console.log('Message received:', event.data);
                    setStatus(`Connected (Last message: ${event.data})`);
                };

                return () => {
                    ws.close();
                };
            } catch (err) {
                console.error('Setup error:', err);
                setError('Setup error: ' + err.message);
            }
        }
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">WebSocket Test</h1>
            <div className="mb-2">Status: {status}</div>
            {error && (
                <div className="text-red-500">Error: {error}</div>
            )}
        </div>
    );
}
