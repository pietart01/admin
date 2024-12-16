
import { useState, useEffect } from 'react';
import { spinService } from '../services/SpinService';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const usePokerHands = () => {
    const [pokerHands, setPokerHands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPokerHands = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('No token found');
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await fetch(`/api/pokerHands?page=${currentPage}&limit=${ITEMS_PER_PAGE}search=${searchTerm}`, { headers });
                if (!response.ok) {
                    throw new Error('Failed to fetch spins');
                }
                const data = await response.json();
                const {pokerHands, pagination} = data;
                setPokerHands(pokerHands);
                // console.log(`totalPages: ${data.pagination.total}`);
                setTotalPages(Math.ceil(data.pagination.total / ITEMS_PER_PAGE));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPokerHands();
    }, [currentPage, searchTerm]);

    return { pokerHands, loading, error, currentPage, totalPages, setCurrentPage, setSearchTerm };
};
