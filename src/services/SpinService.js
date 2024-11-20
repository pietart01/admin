
class SpinService {
  async addSpin(spinId, spinData) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ spinId, ...spinData }),
      });

      if (!response.ok) {
        throw new Error('Failed to add spin');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding spin:', error);
      throw error;
    }
  }
}

export const spinService = new SpinService();
