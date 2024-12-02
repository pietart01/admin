import React, { useState } from 'react';
import { useProfileData } from '../hooks/useProfileData';

export function ProfileInfoTab({userId}) {
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
      { label: '비밀번호', value: profileData.secretNumber, hint: '' },
      { label: '닉네임', value: profileData.username }
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
    ],
    [
      { label: '최근 IP', value: profileData.lastIpAddress },
      { label: '최종 로그인', value: profileData.lastLoginDate }
    ]
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">회원정보</h2>
      
      <div className="grid gap-6">
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
