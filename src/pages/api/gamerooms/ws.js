export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log('*'.repeat(50));
        console.log('Socket is initializing');
        console.log('Request headers:', req.headers);
        console.log('*'.repeat(50));
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        console.log('GET request received');
        res.status(200).json({ message: 'WebSocket endpoint is alive' });
        return;
    }

    console.log('Non-GET request received:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
