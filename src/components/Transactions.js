import { useState } from 'react';
import { DepositTable } from '@/components/DepositTable';
import { DepositSearch } from '@/components/DepositSearch';
import { Pagination } from '@/components/Pagination';
import { useDeposits } from '@/hooks/useDeposits';
import { DepositAmountSelector } from '@/components/DepositAmountSelector';
import { WithdrawAmountSelector } from '@/components/WithdrawAmountSelector';
import { post } from "../lib/api/methods";

export default function Transactions() {
  const {
    deposits,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    fetchDeposits
  } = useDeposits();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleDepositSubmit = async (depositData) => {
    try {
      const data = await post('/deposit', depositData);
      setIsDepositModalOpen(false);
      fetchDeposits();
    } catch (error) {
      console.error('Error submitting deposit:', error);
    }
  };

  const handleWithdrawSubmit = async (withdrawData) => {
    try {
      const data = await post('/withdraw', withdrawData);
      setIsWithdrawModalOpen(false);
      fetchDeposits();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            충전 신청
          </button>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            환전 신청
          </button>
        </div>

        {/* Modals */}
        <DepositAmountSelector 
          isOpen={isDepositModalOpen}
          onClose={() => setIsDepositModalOpen(false)}
          onSubmit={handleDepositSubmit}
          refreshDeposits={fetchDeposits}
        />

        <WithdrawAmountSelector 
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onSubmit={handleWithdrawSubmit}
          refreshDeposits={fetchDeposits}
        />

        {/* Transactions List */}
        <div className="bg-white shadow rounded-lg p-6">
          <DepositSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {deposits.length > 0 && (
                <DepositTable deposits={deposits} />
              )}
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}