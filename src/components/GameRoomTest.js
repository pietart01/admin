// components/GameRoomTest.js
import { useGameRooms } from '../hooks/useGameRooms';

export default function GameRoomTest() {
    const { isConnected, error, sendTestMessage } = useGameRooms();

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">WebSocket Test</h2>
            <div className="mb-4">
                <strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {error && (
                <div className="mb-4 text-red-500">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <button
                onClick={sendTestMessage}
                disabled={!isConnected}
                className={`px-4 py-2 rounded ${
                    isConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
                } text-white`}
            >
                Send Test Message
            </button>
        </div>
    );
}
