import {get} from "../lib/api/methods";

export const rebateService = {
  async getRebates(page, searchTerm) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No token found');
    }

    try {
/*      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`/api/rebate?page=${page}&search=${searchTerm}`, {
        method: 'GET',
        headers
      });*/
      const data = await get('/rebate', { page, search: searchTerm });

/*
      if (!response.ok) {
        throw new Error('Failed to fetch rebates');
      }
*/

      return data;//await response.json();
    } catch (error) {
      console.error('Error fetching rebates:', error);
      throw error;
    }
  }
};
