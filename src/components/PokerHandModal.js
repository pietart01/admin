import React, { useState, useEffect } from 'react';
import { Users, Percent, Target, List, Receipt, X } from 'lucide-react';
import { ProfileInfoTab } from '@/components/ProfileInfoTab';
import PokerPots from "./PokerPots";

export default function PokerHandModal({ isOpen, onClose, handModalData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (handModalData?.id) {
      setRefreshKey(prev => prev + 1);
    }
  }, [handModalData?.id]);

  if (!isOpen) return null;

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
            {/*<h1 className="text-2xl font-bold text-gray-900">포커</h1>*/}
          </div>
          <PokerPots
              pokerHandId={ handModalData?.id}/>
        </div>
      </div>
    </div>
  );
}