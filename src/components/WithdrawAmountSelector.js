import React, { useState } from 'react';
import { XIcon, CreditCardIcon, UserIcon, BuildingIcon } from 'lucide-react';
import { withdrawService } from '@/services/WithdrawService';

export function WithdrawAmountSelector({ onSubmit, refreshWithdrawals }) {
  const [bank, setBank] = useState('제주은행');
  const [accountNumber, setAccountNumber] = useState('1111');
  const [amount, setAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('1111');
  const [phone, setPhone] = useState('1111');
  const [currentBalance] = useState('9');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const predefinedAmounts = [
    { value: 10000, label: '1만원' },
    { value: 50000, label: '5만원' },
    { value: 100000, label: '10만원' },
    { value: 1000000, label: '100만원' }
  ];

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount < 50000) {
      alert('유효한 금액을 입력하세요. 최소 신청단위는 50,000원 입니다.');
      return;
    }

    try {
      const withdrawalData = {
        bank,
        accountNumber,
        amount: parseInt(amount, 10),
        withdrawalPassword
      };

      const response = await withdrawService.submitWithdrawal(withdrawalData);
      if (response.status === 200 || response.status === 201) {
        alert('환전신청이 성공적으로 완료되었습니다.');
        refreshWithdrawals?.();
      } else {
        alert('환전신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Withdrawal submission error:', error);
      alert('환전신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">계좌 정보</h2>
              <button onClick={handleModalToggle} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <BuildingIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">은행:</span>
                  <span className="font-medium text-gray-900">{bank}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CreditCardIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">계좌번호:</span>
                  <span className="font-medium text-gray-900">{accountNumber}</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">예금주:</span>
                  <span className="font-medium text-gray-900">{depositAmount}</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">은행명:</label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계좌번호:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예금주:</label>
            <input
              type="text"
              value={depositAmount}
              readOnly
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환전금액:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액을 입력하거나 선택하세요"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">환전비번:</label>
            <input
              type="password"
              value={withdrawalPassword}
              onChange={(e) => setWithdrawalPassword(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
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
            환전신청
          </button>
        </div>
      </form>
    </div>
  );
}