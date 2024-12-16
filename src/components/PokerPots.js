import { useState } from 'react';
import { spinService } from '@/services/SpinService';
import { SpinsTable } from '@/components/SpinsTable';
import { SpinSearch } from '@/components/SpinSearch';
import { Pagination } from '@/components/Pagination';
import { useSpins } from '@/hooks/useSpins';
import PokerHandsTable from "./PokerHandsTable";
import {usePokerHands} from "../hooks/usePokerHands";
import {usePokerPots} from "../hooks/usePokerPots";
import PokerPotsTable from "./PokerPotsTable";
import PokerPlayersTable from "./PokerPlayersTable";
import PokerHandDisplay from "./PokerHandDisplay";

export default function PokerPots({ pokerHandId }) {
    const {
        pokerPots,
        pokerHand,
        players,
        isLoading,
    } = usePokerPots({pokerHandId});

    const [selectedSpinId, setSelectedSpinId] = useState(null);

    return (
        <div className="p-4">
            <div className="bg-white shadow rounded-lg p-6">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pokerHand && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">게임 정보</h2>
                                <PokerHandDisplay
                                    pokerHand={pokerHand}/>
                            </div>
                        )}

                        {players.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">플레이어 정보</h2>
                                <PokerPlayersTable
                                    players={players}/>
                            </div>
                        )}

                        {pokerPots.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-900">팟 히스토리</h2>
                                <PokerPotsTable
                                    pokerPots={pokerPots}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
