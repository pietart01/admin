import { useGameRooms } from '../hooks/useGameRooms';

export default function GameRooms() {
    const { rooms, isConnected, error, createRoom, reconnect } = useGameRooms();

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={reconnect}>Try Reconnecting</button>
            </div>
        );
    }

    return (
        <div>
            <p>Status: {isConnected ? 'Connected' : 'Disconnecting...'}</p>
            <button onClick={() => createRoom({
                roomName: 'Test Room',
                maxPlayers: 6
            })}>
                Create Room
            </button>
            {rooms.map(room => (
                <div key={room.id}>{room.roomName}</div>
            ))}
        </div>
    );
}
