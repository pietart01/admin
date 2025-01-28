import { useState } from 'react';
import { get } from '../lib/api/methods';

export const useGameDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGameDetails = async (gameId) => {
    try {
      setLoading(true);
      const data = await get(`/gameResultPlayer?gameResultId=${gameId}`);
      return {
        ...data,
        playerResults: data.playerResults || []
      };
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchGameDetails, loading, error };
};