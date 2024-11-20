import { useState } from 'react';
import { spinService } from '@/services/SpinService';
import { SpinsTable } from '@/components/SpinsTable';
import { SpinSearch } from '@/components/SpinSearch';
import { Pagination } from '@/components/Pagination';
import { useSpins } from '@/hooks/useSpins';

export default function Spins() {
  const {
    spins,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refreshSpins
  } = useSpins();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpinId, setSelectedSpinId] = useState(null);

  const handleAddSpin = async (spinData) => {
    try {
      await spinService.addSpin(selectedSpinId, spinData);
      setIsModalOpen(false);
      refreshSpins();
    } catch (error) {
      console.error('Error adding spin:', error);
    }
  };

  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Spins Management</h2> */}
      <div className="bg-white shadow rounded-lg p-6">
        <SpinSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {spins.length > 0 && (
              <SpinsTable
                spins={spins}
                onAddSpin={(spinId) => {
                  setSelectedSpinId(spinId);
                  setIsModalOpen(true);
                }}
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
