export const rebateService = {
  async getRebates(page, searchTerm) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`/api/rebate?page=${page}&search=${searchTerm}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rebates');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching rebates:', error);
      throw error;
    }
  }
}; 