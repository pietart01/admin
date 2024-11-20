export const userService = {
    async addPoints(userId, points) {
      const response = await fetch(`/api/point/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add points');
      }
  
      return response.json();
    },
    async addBonus(userId, bonus) {
      console.log('userId', userId);
      console.log('bonus', bonus);

      const response = await fetch(`/api/bonus/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bonus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add bonus');
      }
  
      return response.json();
    }
  };
  