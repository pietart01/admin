import { useGameRooms } from '../hooks/useGameRooms';

export default function GameRooms() {
    const {
        status,
        rooms,
        error,
        createRoom,
        removeRoom,
        isConnected
    } = useGameRooms();

    const handleCreateRoom = () => {
        createRoom({
            title: `Room ${Date.now()}`,
            maxRoomUserLimit: 6,
            isProtected: false,
            pingMoney: 300,
            minLimitMoney: 0,
            maxLimitMoney: 0,
            playMode: 0
        });
    };

    const getRoomStateLabel = (state) => {
        switch (state) {
            case 0:
                return 'Waiting';
            case 1:
                return 'In Progress';
            default:
                return 'Unknown';
        }
    };

    const getPlayModeLabel = (mode) => {
        switch (mode) {
            case 0:
                return 'Classic';
            case 1:
                return 'Tournament';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Game Rooms</h1>
                <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded ${
                        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {status}
                    </span>
                    <button
                        onClick={handleCreateRoom}
                        disabled={!isConnected}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
                    >
                        Create Room
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map(room => (
                    <div key={room.roomId} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold">
                                    {room.title}
                                    {room.isProtected && (
                                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            Protected
                                        </span>
                                    )}
                                </h3>
                                <span className="text-xs text-gray-500">Room #{room.roomNo}</span>
                            </div>
                            <button
                                onClick={() => removeRoom(room.roomId)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Players:</span>
                                <span>{room.userCount}/{room.maxRoomUserLimit}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ping Money:</span>
                                <span>{room.pingMoney}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mode:</span>
                                <span>{getPlayModeLabel(room.playMode)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span>{getRoomStateLabel(room.roomState)}</span>
                            </div>
                            {(room.minLimitMoney > 0 || room.maxLimitMoney > 0) && (
                                <div className="flex justify-between">
                                    <span>Limits:</span>
                                    <span>
                                        {room.minLimitMoney > 0 ? `Min ${room.minLimitMoney}` : ''}
                                        {room.minLimitMoney > 0 && room.maxLimitMoney > 0 ? ' - ' : ''}
                                        {room.maxLimitMoney > 0 ? `Max ${room.maxLimitMoney}` : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {rooms.length === 0 && isConnected && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No rooms available. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
