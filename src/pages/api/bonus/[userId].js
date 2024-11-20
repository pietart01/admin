// import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return createBonus(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function createBonus(req, res) {
  const { userId } = req.query;
  console.log('createBonus', userId);

  // const { points } = req.body;

  // if (!userId || !points) {
  //   return res.status(400).json({ message: 'User ID and points are required' });
  // }

  try {
    const response = await fetch(`${process.env.API_URL}/integrator/bonus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        bonusAmount: 1
      })
    });

    return res.status(200).json({ message: 'Points added successfully' });
  } catch (error) {
    console.error('Error updating points:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}