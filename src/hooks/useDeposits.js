import { useState, useEffect } from 'react';
import {get} from "../lib/api/methods";
import {ITEMS_PER_PAGE} from "../constants/constants";

export function useDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {

      /*const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

      // Replace with your actual API endpoint
      const response = await fetch(`/api/deposit?page=${currentPage}&search=${searchTerm}`, { headers });
      const data = await response.json();
      console.log('Deposits data:', data);*/
      const data = await get('/deposit', { page: currentPage, limit: ITEMS_PER_PAGE, search: searchTerm });
      console.log(data);

      setDeposits(data.deposits);
      setTotalPages(data.totalPages);
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
