import React from 'react';
import { X } from 'lucide-react';
import { GameResultsTable } from './GameResultsTable';

export const GameDetailsModal = ({ isOpen, onClose, gameDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            게임 상세 정보 - {gameDetails?.roomName}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">방 번호</p>
              <p className="font-medium text-gray-900">{gameDetails?.roomNo}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">총 팟</p>
              <p className="font-medium text-gray-900">{gameDetails?.totalPot?.toLocaleString()}</p>
            </div>
          </div>

          {gameDetails?.playerResults && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">플레이어 결과</h3>
              <GameResultsTable results={gameDetails.playerResults} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};