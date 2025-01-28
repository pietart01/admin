import { useState, useEffect } from 'react';
import { get } from '../lib/api/methods';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const useGameSummary = () => {
  const [gameSummaries, setGameSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGameSummaries = async () => {
      try {
        setLoading(true);
        const data = await get('/gameResult', { 
          page: currentPage, 
          limit: ITEMS_PER_PAGE, 
          search: searchTerm 
        });

        setGameSummaries(data.gameResults);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameSummaries();
  }, [currentPage, searchTerm]);

  return { 
    gameSummaries, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    setSearchTerm 
  };
};