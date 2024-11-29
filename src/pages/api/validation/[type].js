import { executeQuery } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, value } = req.query;

    // Validate input parameters
    if (!type || !value || !['username', 'displayName'].includes(type)) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    // Define column to check based on type
    const column = type === 'username' ? 'username' : 'displayName';
    
    const query = `
      SELECT COUNT(*) as count
      FROM user
      WHERE ${column} = ?
    `;

    const results = await executeQuery(query, [value]);
    const exists = results[0].count > 0;

    return res.status(200).json({ exists });

  } catch (error) {
    console.error('Error in validation API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
