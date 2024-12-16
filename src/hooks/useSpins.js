
import { useState, useEffect } from 'react';
import { spinService } from '../services/SpinService';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const useSpins = () => {
  const [spins, setSpins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSpins = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No token found');
        }
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };

        const response = await fetch(`/api/spins?page=${currentPage}&limit=${ITEMS_PER_PAGE}search=${searchTerm}`, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch spins');
        }
        const data = await response.json();
        const {spins, pagination} = data;
        setSpins(spins);
        // console.log(`totalPages: ${data.pagination.total}`);
        setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSpins();
  }, [currentPage, searchTerm]);

  const addSpin = async (spinId, spinData) => {
    try {
      const newSpin = await spinService.addSpin(spinId, spinData);
      setSpins((prevSpins) => [...prevSpins, newSpin]);
    } catch (error) {
      setError(error.message);
    }
  };

  return { spins, loading, error, addSpin, currentPage, totalPages, setCurrentPage, setSearchTerm };
};
