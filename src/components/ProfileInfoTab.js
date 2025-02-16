import React from 'react';
import { useProfileData } from '../hooks/useProfileData';

export function ProfileInfoTab({userId, userData}) {
  const { profileData, loading, error } = useProfileData(userId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  const formFields = [
    [
      { label: '아이디', value: profileData.id },
      { label: '닉네임', value: profileData.username },
      { label: '최종 로그인', value: profileData.lastLoginDate }
    ],
    [
      { label: '환전비번', value: '******' },
      { label: '예금주', value: profileData.accountNumber },
      { label: '계좌은행', value: profileData.bankName }
    ],
    [
      { label: '휴대폰', value: profileData.phone },
      { label: '계좌번호', value: profileData.accountNumber },
      { label: '가입일', value: profileData.registrationDate }
    ]
  ];

  const summaryData = [
    { label: '누적 충전', value: profileData?.totalDeposit || '0' },
    { label: '누적 환전', value: profileData?.totalWithdraw || '0' },
    { label: '누적 손·환', value: (profileData?.totalDeposit - profileData?.totalWithdraw) || '0' },
    { label: '골드', value: profileData?.balance || '0' },
    { label: '실버', value: profileData?.silver || '0' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">회원정보</h2>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {summaryData.map(({ label, value }, index) => (
              <div
                key={label}
                className={`
                  p-4 text-center
                  ${index !== summaryData.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-gray-200' : ''}
                `}
              >
                <div className="text-sm text-gray-500 mb-1">{label}</div>
                <div className="font-medium text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {formFields.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {row.map((field, fieldIndex) => (
              <div key={fieldIndex} className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.value}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {field.hint && (
                    <span className="absolute right-0 top-0 text-xs text-rose-500 whitespace-nowrap px-2 py-1">
                      {field.hint}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="px-8 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
        >
          수정
        </button>
      </div>
    </div>
  );
}