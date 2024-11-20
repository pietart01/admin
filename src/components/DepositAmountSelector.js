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
    <div className="bg-white shadow rounded-lg p-6 mb-6">
{isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">계좌 정보</h2>
              <button 
                onClick={handleModalToggle}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-4">
                {/* Bank Info */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <BuildingIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">은행</div>
                    <div className="font-medium text-gray-900">{'국민은행'}</div>
                  </div>
                </div>

                {/* Account Number */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">계좌번호</div>
                    <div className="font-medium text-gray-900">{'8888-8888-8888-8888'}</div>
                  </div>
                </div>

                {/* Account Holder */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">예금주</div>
                    <div className="font-medium text-gray-900">{'홍길동'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              계좌 번호:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="계좌문의 눌러 확인해주세요"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              readOnly
            />
          </div>

          {/* Depositor Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              입금자 명:
            </label>
            <input
              type="text"
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              입금 금액:
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="금액을 입력하거나 선택하세요"
            />
          </div>
        </div>

        {/* Amount Buttons */}
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
              type="submit"
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
              type="button"
              onClick={async () => {
                if (!amount || isNaN(amount) || amount < 50000) {
                  alert('유효한 금액을 입력하세요. 최소 신청단위는 50,000원 입니다.');
                  return;
                }

                const depositData = {
                  depositorName,
                  amount: parseInt(amount, 10),
                };

                try {
                  const response = await depositService.submitDeposit(depositData);
                  console.log('response', response);
                  if (response.status === 200 || response.status === 201) {
                    alert('충전신청이 성공적으로 완료되었습니다.');
                    refreshDeposits();
                  } else {
                    alert('충전신청에 실패했습니다. 다시 시도해주세요.');
                  }
                } catch (error) {
                  console.error('Deposit submission error:', error);
                  alert('충전신청 중 오류가 발생했습니다. 다시 시도해주세요.');
                }
              }}
              className="px-8 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium min-w-[120px]"
            >
              충전신청
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