import { useState } from 'react';

export function AddBonusModal({ isOpen, onClose, onSubmit }) {
  const [bonus, setBonus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(Number(bonus));
    setBonus('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-lg font-medium mb-4">보너스 포인트 추가</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              보너스 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 