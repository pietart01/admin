import { useState, useEffect } from 'react';
import { get } from '../lib/api/methods';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const useGameResults = () => {
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGameResults = async () => {
      try {
        setLoading(true);
        const data = await get('/gameResultPlayer', { 
          page: currentPage, 
          limit: ITEMS_PER_PAGE, 
          search: searchTerm 
        });

        setGameResults(data.playerResults);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResults();
  }, [currentPage, searchTerm]);

  return { 
    gameResults, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    setSearchTerm 
  };
};