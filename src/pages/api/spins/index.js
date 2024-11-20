import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

import { ITEMS_PER_PAGE } from '@/constants/constants';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getSpins(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getSpins(req, res) {

    try {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const search = (req.query.search || '').trim();
        const searchPattern = `%${search}%`;
    
        console.log('Search Parameters:', {
          search,
          offset,
          page,
          limit: ITEMS_PER_PAGE
        });
    
        
        // Calculate date 5 days ago
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        
        const spins = await executeQuery(
            `SELECT u.username, 
                    gi.gameName AS game, 
                    gi.gameCode,
                    gi.gameCategoryId,
                    gi.rtpRate,
                    s.payout, 
                    s.betAmount, 
                    s.rollingRate, 
                    s.balanceAfterSpin,
                    s.createdAt
             FROM slotSpin s
             JOIN user u ON s.userId = u.id
             JOIN gameInfo gi ON s.gameInfoId = gi.id
             WHERE s.createdAt >= ? and u.username LIKE ?
             ORDER BY s.createdAt DESC
             LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
            [fiveDaysAgo, searchPattern]
        );
    
        const countResult = await executeQuery(
            `SELECT COUNT(*) AS total
             FROM slotSpin s
             JOIN user u ON s.userId = u.id
             JOIN gameInfo gi ON s.gameInfoId = gi.id
             WHERE s.createdAt >= ? and u.username LIKE ?`,
            [fiveDaysAgo, searchPattern]
        );
    
        return res.status(200).json({
            spins,
            pagination: {
                total: countResult[0].total,
                page,
                perPage: ITEMS_PER_PAGE,
                totalPages: Math.ceil(countResult[0].total / ITEMS_PER_PAGE)
            }
        });
    } catch (error) {
        console.error('Error fetching spins:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
