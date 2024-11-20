class WithdrawService {
    async submitDeposit(depositData) {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token found');
      }
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await fetch('/api/deposit', {
          method: 'POST',
          headers,
          body: JSON.stringify(depositData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit deposit');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error submitting deposit:', error);
        throw error;
      }
    }
  }
  
  export const withdrawService = new WithdrawService(); 