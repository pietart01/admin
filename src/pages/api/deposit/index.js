import { executeQuery } from '@/lib/db';
import {authMiddleware} from '@/middleware/authMiddleware';

async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request for creating a new deposit
    const { amount } = req.body;
    const {userId} = req.user;

    console.log('req.user.userId', req.user.userId);

    const currencyType = 'KRW';
    const transactionType = 'DEPOSIT';
    const description = null;
    const recipientUserId = null;

    if (!userId || !transactionType || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const insertQuery = `
        INSERT INTO userTransaction (userId, transactionType, currencyType, amount, recipientUserId, description, transactionDate)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      const result = await executeQuery(insertQuery, [userId, transactionType, currencyType, amount, recipientUserId, description]);

      return res.status(201).json({ message: 'Deposit created successfully', depositId: result.insertId, status: 201 });
    } catch (error) {
      console.error('Error creating deposit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Items per page
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Build the search condition
    const searchCondition = search
      ? `WHERE 
          userId LIKE ? OR 
          transactionType LIKE ? OR 
          currencyType LIKE ? OR 
          description LIKE ?`
      : '';

    // Count total records for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM userTransaction 
      WHERE transactionType = 'DEPOSIT'
      ${search ? 'AND (' + searchCondition.replace('WHERE', '') + ')' : ''}
    `;

    const searchParams = search
      ? [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      : [];

    const countResult = await executeQuery(countQuery, searchParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get deposits with pagination and search
    const depositsQuery = `
      SELECT 
        id,
        userId,
        transactionType,
        currencyType,
        amount,
        recipientUserId,
        description,
        transactionDate
      FROM userTransaction
      WHERE transactionType = 'DEPOSIT'
      ${search ? 'AND (' + searchCondition.replace('WHERE', '') + ')' : ''}
      ORDER BY transactionDate DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    const deposits = await executeQuery(
      depositsQuery,
      searchParams  // Only include search parameters
    );

    return res.status(200).json({
      deposits,
      currentPage: page,
      totalPages,
      totalItems: total
    });

  } catch (error) {
    console.error('Error in deposits API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export default authMiddleware(handler);