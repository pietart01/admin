// pages/test-endpoint.js
import { useEffect, useState } from 'react';

export default function TestEndpoint() {
    const [status, setStatus] = useState('Testing...');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function testEndpoint() {
            try {
                console.log('Testing endpoint...');
                const response = await fetch('/api/ws');
                const data = await response.json();
                console.log('Response:', data);
                setStatus('Endpoint responded: ' + JSON.stringify(data));
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setStatus('Failed');
            }
        }

        testEndpoint();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">API Endpoint Test</h1>
            <div className="mb-4">Status: {status}</div>
            {error && (
                <div className="text-red-500">Error: {error}</div>
            )}
        </div>
    );
}
