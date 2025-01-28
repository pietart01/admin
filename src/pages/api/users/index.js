import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import { ITEMS_PER_PAGE } from '@/constants/constants';


export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getUsers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const search = (req.query.search || '').trim();
    const searchPattern = `%${search}%`;

    console.log('Search Parameters:', {
      search,
      offset,
      page,
      limit: ITEMS_PER_PAGE
    });

    // Updated query without placeholders for LIMIT and OFFSET
    const usersQuery = `
WITH transaction_sums AS (
    SELECT userId,
        SUM(CASE WHEN transactionType = 'DEPOSIT' THEN amount ELSE 0 END) as deposit,
        SUM(CASE WHEN transactionType = 'WITHDRAW' THEN amount ELSE 0 END) as withdraw,
        SUM(CASE WHEN transactionType = 'REBATE' THEN amount ELSE 0 END) as rebate,
        SUM(amount) as total_amount
    FROM userTransaction
    GROUP BY userId
)
SELECT combined_results.*, 
    FLOOR(COALESCE(ts.deposit, 0)) as deposit,
    FLOOR(COALESCE(ts.withdraw, 0)) as withdraw,
    FLOOR(COALESCE(ts.rebate, 0)) as rebate,
    FLOOR(COALESCE(ts.rebate*20, 0)) as betting,
    FLOOR(COALESCE(ts.total_amount, 0)) as total_amount
FROM (
    SELECT u.id, u.username, u.balance, u.registrationDate, u.parentUserId, u.level, u.rebateBalance
    FROM user u
    WHERE u.username LIKE ?
    UNION
    SELECT u2.id, u2.username, u2.balance, u2.registrationDate, u2.parentUserId, u2.level, u2.rebateBalance
    FROM user u2
    INNER JOIN user u1 ON u2.parentUserId = u1.id
    WHERE u1.username LIKE ?
    UNION
    SELECT u3.id, u3.username, u3.balance, u3.registrationDate, u3.parentUserId, u3.level, u3.rebateBalance
    FROM user u3
    INNER JOIN user u1 ON u3.id = u1.parentUserId
    WHERE u1.username LIKE ?
) AS combined_results
LEFT JOIN transaction_sums ts ON combined_results.id = ts.userId
ORDER BY id DESC
LIMIT ${Number(ITEMS_PER_PAGE)}
OFFSET ${Number(offset)}
    `;

    const users = await executeQuery(usersQuery, [
      searchPattern,
      searchPattern,
      searchPattern
    ]);

    // Count query remains the same
    const countQuery = `
      SELECT COUNT(DISTINCT id) as total FROM (
        SELECT u.id FROM user u 
        WHERE u.username LIKE ?
        UNION
        SELECT u2.id FROM user u2
        INNER JOIN user u1 ON u2.parentUserId = u1.id
        WHERE u1.username LIKE ?
        UNION
        SELECT u3.id FROM user u3
        INNER JOIN user u1 ON u3.id = u1.parentUserId
        WHERE u1.username LIKE ?
      ) t
    `;

    const countResult = await executeQuery(countQuery, [
      searchPattern,
      searchPattern,
      searchPattern
    ]);

    // Send response
    return res.status(200).json({
        users,
        pagination: {
          total: countResult[0].total,
          page,
          perPage: ITEMS_PER_PAGE,
          totalPages: Math.ceil(countResult[0].total / ITEMS_PER_PAGE)
        }
    });

  } catch (error) {
    console.error('Error in getUsers:', {
      message: error.message,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

async function createUser(req, res) {

}
