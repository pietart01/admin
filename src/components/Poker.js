import { useState } from 'react';
import { spinService } from '@/services/SpinService';
import { SpinsTable } from '@/components/SpinsTable';
import { SpinSearch } from '@/components/SpinSearch';
import { Pagination } from '@/components/Pagination';
import { useSpins } from '@/hooks/useSpins';
import PokerHandsTable from "./PokerHandsTable";
import {usePokerHands} from "../hooks/usePokerHands";

export default function Poker({onOpen}) {
    const {
        pokerHands,
        currentPage,
        totalPages,
        isLoading,
        searchTerm,
        setSearchTerm,
        setCurrentPage,
        refreshSpins
    } = usePokerHands();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpinId, setSelectedSpinId] = useState(null);

    return (
        <div className="p-4">
            <div className="bg-white shadow rounded-lg p-6">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <>
                        {pokerHands.length > 0 && (
                            <PokerHandsTable
                                hands={pokerHands}
                                onClick={(data) => onOpen?.(data)}
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
