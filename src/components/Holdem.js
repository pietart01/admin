import React, { useState } from 'react';
import { useGameResults } from '../hooks/useGameResults';
import { useGameSummary } from '../hooks/useGameSummary';
import { useGameDetails } from '../hooks/useGameDetails';
import { useMoneyTransactions } from '../hooks/useMoneyTransactions';
import { GameResultsTable } from './GameResultsTable';
import { GameSummaryTable } from './GameSummaryTable';
import { MoneyTransactionsTable } from './MoneyTransactionsTable';
import { GameResultSearch } from './GameResultSearch';
import { GameDetailsModal } from './GameDetailsModal';
import { Pagination } from './Pagination';
import GameRooms from "./GameRoomList";

export default function Holdem() {
  const [activeView, setActiveView] = useState('rooms');
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    gameResults,
    loading: playerLoading,
    error: playerError,
    currentPage: playerPage,
    totalPages: playerTotalPages,
    setCurrentPage: setPlayerPage,
    setSearchTerm: setPlayerSearch,
  } = useGameResults();

  const {
    gameSummaries,
    loading: gameLoading,
    error: gameError,
    currentPage: gamePage,
    totalPages: gameTotalPages,
    setCurrentPage: setGamePage,
    setSearchTerm: setGameSearch,
  } = useGameSummary();

  const {
    transactions,
    summary,
    loading: transactionLoading,
    error: transactionError,
    currentPage: transactionPage,
    totalPages: transactionTotalPages,
    setCurrentPage: setTransactionPage,
    setSearchTerm: setTransactionSearch,
  } = useMoneyTransactions();

  const { fetchGameDetails } = useGameDetails();

  const getActiveViewData = () => {
    switch (activeView) {
      case 'player':
        return {
          loading: playerLoading,
          error: playerError,
          currentPage: playerPage,
          totalPages: playerTotalPages,
          setCurrentPage: setPlayerPage,
          setSearchTerm: setPlayerSearch,
        };
      case 'game':
        return {
          loading: gameLoading,
          error: gameError,
          currentPage: gamePage,
          totalPages: gameTotalPages,
          setCurrentPage: setGamePage,
          setSearchTerm: setGameSearch,
        };
      case 'transaction':
        return {
          loading: transactionLoading,
          error: transactionError,
          currentPage: transactionPage,
          totalPages: transactionTotalPages,
          setCurrentPage: setTransactionPage,
          setSearchTerm: setTransactionSearch,
        };
      default:
        return {};
    }
  };

  const handleGameClick = async (game) => {
    const details = await fetchGameDetails(game.id);
    if (details) {
      setSelectedGame({ ...game, playerResults: details.playerResults });
      setModalOpen(true);
    }
  };

  const { loading, error, currentPage, totalPages, setCurrentPage, setSearchTerm } = getActiveViewData();

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveView('rooms')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'rooms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            게임방
          </button>
          <button
            onClick={() => setActiveView('player')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'player'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            플레이어 결과
          </button>
          <button
            onClick={() => setActiveView('game')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'game'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            게임 결과
          </button>
          <button
            onClick={() => setActiveView('transaction')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'transaction'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            머니 내역
          </button>
        </div>

        {activeView !== 'rooms' && (
          <GameResultSearch
            searchTerm=""
            setSearchTerm={setSearchTerm}
          />
        )}
        
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {activeView === 'rooms' && <GameRooms />}
            {activeView === 'player' && <GameResultsTable results={gameResults} />}
            {activeView === 'game' && (
              <GameSummaryTable 
                summaries={gameSummaries} 
                onGameClick={handleGameClick}
              />
            )}
            {activeView === 'transaction' && (
              <MoneyTransactionsTable 
                transactions={transactions}
                summary={summary}
              />
            )}
            
            {activeView !== 'rooms' && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <GameDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        gameDetails={selectedGame}
      />
    </div>
  );
}