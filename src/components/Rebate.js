import { useState } from 'react';
import { RebateTable } from '@/components/RebateTable';
import { RebateSearch } from '@/components/RebateSearch';
import { Pagination } from '@/components/Pagination';
import { useRebates } from '@/hooks/useRebates';

export default function Rebate() {
  const {
    rebates,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refreshRebates
  } = useRebates();

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Rebate Management</h2> */}
      <div className="bg-white shadow rounded-lg p-6">
        <RebateSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {rebates.length > 0 && (
              <RebateTable
                rebates={rebates}
              />
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
  );
} 