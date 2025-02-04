import { useState, useEffect } from 'react';
import { get } from "../lib/api/methods";
import { ITEMS_PER_PAGE } from "../constants/constants";

export function useDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const data = await get('/transactions', { 
        page: currentPage, 
        limit: ITEMS_PER_PAGE, 
        search: searchTerm,
        types: 'DEPOSIT'
      });

      setDeposits(data.transactions);
      setTotalPages(data.totalPages); // Use totalPages directly from response
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, searchTerm]);

  return {
    deposits,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    fetchDeposits
  };
}