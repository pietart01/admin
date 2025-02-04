import React from 'react';
import { useProfileData } from '../hooks/useProfileData';

export function RateTab({ userId }) {
  const { profileData, loading, error } = useProfileData(userId);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  // Get rates by category
  const getRateByCategory = (categoryId) => {
    const settings = profileData.rebateSettings || [];
    const setting = settings.find(s => s.gameCategoryId === categoryId);
    return setting ? setting.rollingRebatePercentage : 0;
  };

  const rates = [
    {
      label: '홀덤 요율',
      value: getRateByCategory(1),
      description: '홀덤 게임에 대한 롤링 요율'
    },
    {
      label: '포커 요율',
      value: getRateByCategory(2),
      description: '포커 게임에 대한 롤링 요율'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">요율 정보</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {rates.map((rate) => (
          <div key={rate.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{rate.label}</h3>
              <span className="text-2xl font-bold text-blue-600">
                {rate.value}%
              </span>
            </div>
            <p className="text-sm text-gray-500">{rate.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}