import React, { useState } from 'react';
import { XIcon, CreditCardIcon, UserIcon, BuildingIcon } from 'lucide-react';
import { depositService } from '@/services/DepositService';

export function DepositAmountSelector({ onSubmit, refreshDeposits }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [depositorName, setDepositorName] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const predefinedAmounts = [
    { value: 10000, label: '1만원' },
    { value: 50000, label: '5만원' },
    { value: 100000, label: '10만원' },
    { value: 1000000, label: '100만원' }
  ];

  const accountInfo = {
    bank: '국민은행',
    accountNumber: accountNumber,
    depositorName: depositorName,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ accountNumber, depositorName, amount });
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">계좌 정보</h2>
              <button onClick={handleModalToggle} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <BuildingIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">은행:</span>
                  <span className="font-medium text-gray-900">{'국민은행'}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CreditCardIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">계좌번호:</span>
                  <span className="font-medium text-gray-900">{'8888-8888-8888-8888'}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">예금주:</span>
                  <span className="font-medium text-gray-900">{'홍길동'}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={handleModalToggle}
                className="w-full py-2 bg-gray-900 text-white rounded hover:bg-gray-800 font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계좌 번호:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">입금자명:</label>
            <input
              type="text"
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">금액:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setAmount((current) => {
                const currentValue = parseInt(current) || 0;
                return currentValue + preset.value;
              })}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              +{preset.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={handleModalToggle}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            계좌정보 보기
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            입금하기
          </button>
        </div>
      </form>
    </div>
  );
}