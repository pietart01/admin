import { useState, useEffect } from 'react';
import { get } from '../lib/api/methods';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const useMoneyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await get('/moneyTransaction', { 
          page: currentPage, 
          limit: ITEMS_PER_PAGE, 
          search: searchTerm 
        });

        setTransactions(data.transactions);
        setSummary(data.summary);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, searchTerm]);

  return { 
    transactions, 
    summary,
    loading, 
    error, 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    setSearchTerm 
  };
};