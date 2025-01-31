import { useGameRooms } from '../hooks/useGameRooms';
import { CreateRoomModal } from './CreateRoomModal';
import { useState } from 'react';

export default function GameRooms() {
    const {
        status,
        rooms,
        error,
        createRoom,
        removeRoom,
        isConnected
    } = useGameRooms();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateRoom = (roomData) => {
        console.log('Create room:', JSON.stringify(roomData));
        // createRoom(roomData);
    };

    const getRoomStateLabel = (state) => {
        switch (state) {
            case 0:
                return '대기중';
            case 1:
                return '게임중';
            default:
                return '알수없음';
        }
    };

    const getPlayModeLabel = (mode) => {
        switch (mode) {
            case 0:
                return '일반';
            case 1:
                return '토너먼트';
            default:
                return '알수없음';
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">게임방 목록</h1>
                <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded ${
                        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {isConnected ? '연결됨' : '연결안됨'}
                    </span>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={!isConnected}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
                    >
                        방 만들기
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
                                            비밀방
                                        </span>
                                    )}
                                </h3>
                                <span className="text-xs text-gray-500">방번호 #{room.roomNo}</span>
                            </div>
                            <button
                                onClick={() => removeRoom(room.roomId)}
                                className="text-red-500 hover:text-red-700"
                            >
                                삭제
                            </button>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>인원:</span>
                                <span>{room.userCount}/{room.maxRoomUserLimit}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>핑머니:</span>
                                <span>{room.pingMoney.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>모드:</span>
                                <span>{getPlayModeLabel(room.playMode)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>상태:</span>
                                <span>{getRoomStateLabel(room.roomState)}</span>
                            </div>
                            {(room.minLimitMoney > 0 || room.maxLimitMoney > 0) && (
                                <div className="flex justify-between">
                                    <span>제한:</span>
                                    <span>
                                        {room.minLimitMoney > 0 ? `최소 ${room.minLimitMoney.toLocaleString()}` : ''}
                                        {room.minLimitMoney > 0 && room.maxLimitMoney > 0 ? ' - ' : ''}
                                        {room.maxLimitMoney > 0 ? `최대 ${room.maxLimitMoney.toLocaleString()}` : ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {rooms.length === 0 && isConnected && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        생성된 방이 없습니다. 새로운 방을 만들어보세요!
                    </div>
                )}
            </div>

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateRoom}
            />
        </div>
    );
}
