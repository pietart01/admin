import {post} from "../lib/api/methods";

class WithdrawService {
    async submitWithdrawal(depositData) {
      try {
        const data = await post('/withdraw', depositData);
        console.log('data', data);
        return data;
      } catch (error) {
        console.error('Error submitting withdraw:', error);
        throw error;
      }
    }
  }

  export const withdrawService = new WithdrawService();
