import { executeQuery } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    const query = `
      SELECT 
        id,
        username,
        email,
        displayName,
        balance,
        parentUserId,
        level,
        accountHolder,
        bankName,
        accountNumber,
        isGameRestriction,
        isLocked,
        silver,
        rebateBalance,
        phone,
        registrationDate,
        lastLoginDate
      FROM user
      WHERE id = ?
    `;

    const rebateQuery = `
      SELECT 
        rollingRebatePercentage,
        losingRebatePercentage
      FROM userRebateSetting
      WHERE childUserId = ?
    `;

    const results = await executeQuery(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rebateResults = await executeQuery(rebateQuery, [userId]);
    const rebate = rebateResults.length > 0 ? rebateResults[0] : null;
    console.log('rebate', rebate);
    console.log('userId', userId);

    // Remove sensitive information
    let user = results[0];
    delete user.passwordHash;

    user = {...user, ...rebate};
    console.log('user', user);
    return res.status(200).json(user);

  } catch (error) {
    console.error('Error in profile API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
