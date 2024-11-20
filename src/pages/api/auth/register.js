// src/pages/api/auth/register.js
import bcrypt from 'bcryptjs';
// import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // const connection = await pool.getConnection();

    await executeQuery(
      'INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // connection.release();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
