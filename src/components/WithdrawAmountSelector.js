import React, { useState } from 'react';
import { XIcon, CreditCardIcon, UserIcon, BuildingIcon, LockIcon } from 'lucide-react';
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
                  <span className="font-medium text-gray-900">{bank}</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-500 w-20">계좌번호:</span>
                  <span className="font-medium text-gray-900">{accountNumber}</span>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-500 w-20">예금주:</span>
                  <span className="font-medium text-gray-900">{depositAmount}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">은행명</label>
            <input
              type="text"
              value={bank}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">계좌번호</label>
            <input
              type="text"
              value={accountNumber}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">예금주</label>
            <input
              type="text"
              value={depositAmount}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">연락처</label>
            <input
              type="text"
              value={phone}
              readOnly
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">환전금액</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액을 입력하거나 선택하세요"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">환전비밀번호</label>
            <input
              type="password"
              value={withdrawalPassword}
              onChange={(e) => setWithdrawalPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
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
            <LockIcon className="w-4 h-4" />
            환전신청
          </button>
        </div>
      </form>
    </div>
  );
}