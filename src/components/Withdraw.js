import { useState } from 'react';
import { DepositTable } from '@/components/DepositTable';
import { DepositSearch } from '@/components/DepositSearch';
import { Pagination } from '@/components/Pagination';
import { useDeposits } from '@/hooks/useDeposits';
import { WithdrawAmountSelector } from '@/components/WithdrawAmountSelector';

export default function Withdraw() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDepositSubmit = (depositData) => {
    console.log('Deposit submitted:', depositData);
    setIsModalOpen(false);
    // Handle deposit submission logic here
    // fetchDeposits();
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Add button to open modal */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            환전 신청
          </button>
        </div>

        {/* Modal Component */}
        <WithdrawAmountSelector 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleDepositSubmit} 
          refreshDeposits={() => fetchDeposits()}
        />

        {/* Existing Deposit List */}
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