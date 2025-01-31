import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CreateRoomModal({ isOpen, onClose, onSubmit }) {
  const [roomData, setRoomData] = useState({
    title: '',
    maxRoomUserLimit: 6,
    isProtected: false,
    password: '',
    pingMoney: 300,
    minLimitMoney: 0,
    maxLimitMoney: 0,
    playMode: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(roomData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">방 만들기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">방 제목</label>
            <input
              type="text"
              value={roomData.title}
              onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최대 인원</label>
            <select
              value={roomData.maxRoomUserLimit}
              onChange={(e) => setRoomData({ ...roomData, maxRoomUserLimit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>{num}명</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">핑머니</label>
            <input
              type="number"
              value={roomData.pingMoney}
              onChange={(e) => setRoomData({ ...roomData, pingMoney: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              required
            />
          </div>

{/*          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최소 금액</label>
              <input
                type="number"
                value={roomData.minLimitMoney}
                onChange={(e) => setRoomData({ ...roomData, minLimitMoney: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최대 금액</label>
              <input
                type="number"
                value={roomData.maxLimitMoney}
                onChange={(e) => setRoomData({ ...roomData, maxLimitMoney: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
              />
            </div>
          </div>*/}

{/*          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">게임 모드</label>
            <select
              value={roomData.playMode}
              onChange={(e) => setRoomData({ ...roomData, playMode: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value={0}>일반</option>
              <option value={1}>토너먼트</option>
            </select>
          </div>*/}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isProtected"
              checked={roomData.isProtected}
              onChange={(e) => setRoomData({ ...roomData, isProtected: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="isProtected" className="ml-2 text-sm text-gray-700">비밀방</label>
          </div>

          {roomData.isProtected && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                value={roomData.password}
                onChange={(e) => setRoomData({ ...roomData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                required={roomData.isProtected}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
