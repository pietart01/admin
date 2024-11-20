import React from 'react';
import { useProfileData } from '../hooks/useProfileData';

export default function DashboardOverview() {
  const { profileData } = useProfileData();

  const balance = profileData ? profileData.balance : 0;
  const rebateBalance = profileData ? profileData.rebateBalance : 0;

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">대시보드 개요</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">잔액</h3>
          <p className="text-3xl font-bold text-blue-600">{balance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">딜러비</h3>
          <p className="text-3xl font-bold text-green-600">{rebateBalance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
} 