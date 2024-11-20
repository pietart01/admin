import { useState } from 'react';
import { DepositTable } from '@/components/DepositTable';
import { DepositSearch } from '@/components/DepositSearch';
import { Pagination } from '@/components/Pagination';
import { useDeposits } from '@/hooks/useDeposits';
import { DepositAmountSelector } from '@/components/DepositAmountSelector';
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

  const handleDepositSubmit = (depositData) => {
    console.log('Deposit submitted:', depositData);
    // Handle deposit submission logic here
    // fetchDeposits();
  };

  return (
    <div className="p-4">
      <div className="space-y-6">
        {/* Amount Selector Component */}
        <WithdrawAmountSelector onSubmit={handleDepositSubmit} refreshDeposits={() => fetchDeposits()}/>

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