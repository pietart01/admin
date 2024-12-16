
import { useState, useEffect } from 'react';
import { spinService } from '../services/SpinService';
import { ITEMS_PER_PAGE } from '../constants/constants';

export const usePokerPots = ({pokerHandId}) => {
    const [pokerPots, setPokerPots] = useState([]);
    const [pokerHand, setPokerHand] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [pokerHandId, setPokerHandId] = useState(1);

    useEffect(() => {
        const fetchPokerHands = async (pokerHandId) => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    throw new Error('No token found');
                }
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await fetch(`/api/pokerPots/${pokerHandId}`, { headers });
                if (!response.ok) {
                    throw new Error('Failed to fetch spins');
                }
                const data = await response.json();
                const {pokerPots, pokerHand, players} = data;

                setPokerPots(pokerPots);
                setPokerHand(pokerHand);
                setPlayers(players);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if(pokerHandId) {
            fetchPokerHands(pokerHandId);
        }
    }, [pokerHandId]);

    return { pokerPots, pokerHand, players, loading, error };
};
