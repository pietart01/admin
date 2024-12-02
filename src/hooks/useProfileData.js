import { useState, useEffect } from 'react';

export function useProfileData(userId) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchProfileData(userId);
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      console.log('data', data);
      setProfileData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { profileData, loading, error, refetch: fetchProfileData };
} 