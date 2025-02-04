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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Account Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">계좌 정보</h2>
              <button onClick={handleModalToggle} className="text-gray-400 hover:text-gray-600 transition-colors">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BuildingIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-500 w-20">은행:</span>
                  <span className="font-medium text-gray-900">{'국민은행'}</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-500 w-20">계좌번호:</span>
                  <span className="font-medium text-gray-900">{'8888-8888-8888-8888'}</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-500 w-20">예금주:</span>
                  <span className="font-medium text-gray-900">{'홍길동'}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleModalToggle}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">계좌 번호</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="계좌번호를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">입금자명</label>
            <input
              type="text"
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="입금자명을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="금액을 입력하세요"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setAmount((current) => {
                const currentValue = parseInt(current) || 0;
                return currentValue + preset.value;
              })}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              +{preset.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleModalToggle}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
          >
            <CreditCardIcon className="w-4 h-4" />
            계좌정보 보기
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            입금하기
          </button>
        </div>
      </form>
    </div>
  );
}