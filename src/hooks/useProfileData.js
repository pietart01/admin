import { useState, useEffect } from 'react';
import { get } from '../lib/api/methods';

export function useProfileData(userId) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchProfileData(userId);
    }
  }, [userId]);

  const fetchProfileData = async (userId) => {
    console.log('fetchProfileData')
    try {
      setLoading(true);
      // Replace with your actual API endpoint

      const data = await get(`/profile/${userId}`, {  });
      console.log('data', data);
      setProfileData(data);

      /*
            const response = await fetch(`/api/profile/${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            console.log('data', data);
            setProfileData(data);
      */
    } catch (err) {
      console.log('err', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { profileData, loading, error, refetch: fetchProfileData };
}
