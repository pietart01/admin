import { useState, useEffect } from 'react';
import { rebateService } from '@/services/rebateService';
import { ITEMS_PER_PAGE } from '@/constants/constants';

export function useRebates() {
  const [rebates, setRebates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRebates = async () => {
    setIsLoading(true);
    try {
      const response = await rebateService.getRebates(currentPage, searchTerm);
      const data = response;
      console.log(data);
      const {rebates, pagination} = data;
      setRebates(rebates);
      // setTotalPages(response.totalPages);
      setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching rebates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRebates();
  }, [currentPage, searchTerm]);

  return {
    rebates,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refreshRebates: fetchRebates
  };
} 