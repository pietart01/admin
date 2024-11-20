import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return createPoint(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function createPoint(req, res) {
  const { userId } = req.query;
  const { points } = req.body;

  if (!userId || !points) {
    return res.status(400).json({ message: 'User ID and points are required' });
  }

  try {
    // const connection = await pool.getConnection();
    const updateQuery = 'UPDATE user SET balance = balance + ? WHERE id = ?';
    await executeQuery(updateQuery, [points, userId]);
    // connection.release();

    return res.status(200).json({ message: 'Points added successfully' });
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}