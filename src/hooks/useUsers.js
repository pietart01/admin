// hooks/useUsers.js
import { useState, useEffect } from 'react';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
        const data = await response.json();
        console.log('data', data);
        setUsers(data.users);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  const refreshUsers = async () => {
    const response = await fetch(`/api/users?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
    const data = await response.json();
    setUsers(data.users);
    setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
  };

  return {
    users,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    refreshUsers
  };
};