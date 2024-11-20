import { verify } from 'jsonwebtoken';

export function authMiddleware(handler) {
    return async (req, res) => {
        console.log('req.headers', req.headers);
        const token = req.headers.authorization?.split(' ')[1];
        console.log('token', token);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const decodedToken = verify(token, process.env.JWT_SECRET);
            req.user = decodedToken; // Attach the user to the request
            return handler(req, res);
        } catch (error) {
            console.log('error', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}
