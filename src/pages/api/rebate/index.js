import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

import { ITEMS_PER_PAGE } from '@/constants/constants';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getRebates(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getRebates(req, res) {
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

        let whereClause = '';
        let params = [];

        if (search) {
            whereClause = 'WHERE u.username LIKE ?';
            params = [searchPattern];
        }

        // Modified count query
        const countResult = await executeQuery(
            `SELECT COUNT(*) as total 
             FROM rebateLog r
             LEFT JOIN user u ON r.userId = u.id
             ${whereClause}`,
            params
        );

        // Modified main query with direct pagination values
        const rebates = await executeQuery(
            `SELECT r.*,
                    gc.categoryName as gameCategoryName,
                    u.username,
                    u.displayName,
                    u.email
             FROM rebateLog r
             LEFT JOIN gameCategory gc ON r.gameCategoryId = gc.id
             LEFT JOIN user u ON r.userId = u.id
             ${whereClause}
             ORDER BY r.createdAt DESC
             LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
            params
        );

        return res.status(200).json({
            rebates,
            pagination: {
                total: countResult[0].total,
                page,
                perPage: ITEMS_PER_PAGE,
                totalPages: Math.ceil(countResult[0].total / ITEMS_PER_PAGE)
            }
        });
    } catch (error) {
        console.error('Error fetching rebates:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}