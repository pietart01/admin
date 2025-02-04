import React, { useState, useEffect } from 'react';
import { Users, Percent, List, Receipt, X } from 'lucide-react';
import { ProfileInfoTab } from '@/components/ProfileInfoTab';

const EmptyTab = ({ title }) => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">준비 중입니다.</p>
  </div>
);

export default function Profile({ isOpen, onClose, userData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (userData?.id) {
      setRefreshKey(prev => prev + 1);
    }
  }, [userData?.id]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: '회원정보', icon: Users, color: 'bg-blue-400 hover:bg-blue-500' },
    { id: 'rate', label: '요율', icon: Percent, color: 'bg-white hover:bg-gray-50' },
    { id: 'history', label: '입출금내역', icon: List, color: 'bg-white hover:bg-gray-50' },
    { id: 'games', label: '게임내역', icon: Receipt, color: 'bg-white hover:bg-gray-50' }
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

          {/* Tab Content Area */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'profile' && <ProfileInfoTab key={refreshKey} userId={userData?.id} />}
            {activeTab === 'rate' && <EmptyTab title="요율" />}
            {activeTab === 'history' && <EmptyTab title="내 손익" />}
            {activeTab === 'games' && <EmptyTab title="게임내역" />}
          </div>
        </div>
      </div>
    </div>
  );
}
