import React, { useState } from 'react';
import { Users, Percent, Target, List, Receipt, X } from 'lucide-react';
import { ProfileInfoTab } from '@/components/ProfileInfoTab';

const EmptyTab = ({ title }) => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">준비 중입니다.</p>
  </div>
);

export default function Profile({ isOpen, onClose, userData }) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: '회원정보', icon: Users, color: 'bg-blue-400 hover:bg-blue-500' },
    { id: 'rate', label: '요율', icon: Percent, color: 'bg-white hover:bg-gray-50' },
    { id: 'target', label: '쪽지', icon: List, color: 'bg-white hover:bg-gray-50' },
    { id: 'history', label: '내 손익', icon: List, color: 'bg-white hover:bg-gray-50' },
    { id: 'mini', label: '머니', icon: Receipt, color: 'bg-white hover:bg-gray-50' }
  ];

  const summaryData = [
    { label: '누적 충전', value: userData?.totalCharge || '0원' },
    { label: '누적 환전', value: userData?.totalExchange || '0원' },
    { label: '누적 손·환', value: userData?.totalProfitLoss || '0원' },
    { label: '보유 머니', value: userData?.currentMoney || '0원' },
    { label: '보유 엘리비', value: userData?.currentPoints || '0원' },
    { label: '지갑', value: userData?.wallet || '0' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">회원현황</h1>
            {/* <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                게임 체험
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                충전 차단 관리
              </button>
            </div> */}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${activeTab === id 
                    ? 'text-white bg-blue-500' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Summary Table */}
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

          {/* Tab Content Area */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'profile' && <ProfileInfoTab />}
            {activeTab === 'rate' && <EmptyTab title="요율" />}
            {activeTab === 'target' && <EmptyTab title="쪽지" />}
            {activeTab === 'history' && <EmptyTab title="내 손익" />}
            {activeTab === 'mini' && <EmptyTab title="머니" />}
          </div>
        </div>
      </div>
    </div>
  );
}