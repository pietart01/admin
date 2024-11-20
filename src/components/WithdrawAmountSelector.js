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

      const response = await WithdrawService.submitWithdrawal(withdrawalData);
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
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">계좌 정보</h2>
              <button 
                onClick={handleModalToggle}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BuildingIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">은행</div>
                    <div className="font-medium text-gray-900">{bank}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">계좌번호</div>
                    <div className="font-medium text-gray-900">{accountNumber}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">예금주</div>
                    <div className="font-medium text-gray-900">{depositAmount}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleModalToggle}
                className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              은행 명:
            </label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              계좌 번호:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              예금주:
            </label>
            <input
              type="text"
              value={depositAmount}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              연락처:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              환전금액:
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="금액을 입력하거나 선택하세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {/* <div className="text-sm text-blue-600">
              보유머니 {currentBalance}
            </div> */}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              환전비번:
            </label>
            <input
              type="password"
              value={withdrawalPassword}
              onChange={(e) => setWithdrawalPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {predefinedAmounts.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value.toString())}
                className="px-4 py-2.5 bg-navy-800 text-white rounded-lg hover:bg-navy-900 transition-colors text-sm font-medium"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2.5 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-sm font-medium"
            >
              정정
            </button>
          </div>

          <p className="text-red-500 text-sm text-center">
            ※최소 신청단위는 50,000원 입니다.
          </p>

          <div className="flex justify-center gap-3">
            <button
              type="submit"
              className="px-8 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium min-w-[120px]"
            >
              환전신청
            </button>
            <button
              type="button"
              onClick={handleModalToggle}
              className="px-8 py-2.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium min-w-[120px]"
            >
              계좌문의
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}