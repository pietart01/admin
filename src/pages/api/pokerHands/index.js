import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import { ITEMS_PER_PAGE } from '@/constants/constants';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getPokerHands(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getPokerHands(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const search = (req.query.search || '').trim();
        const searchPattern = `%${search}%`;

        // Calculate date 5 days ago
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        // todo: implement the query to fetch poker hands like example
        // select ph.id as id, ph.startTime, ph.endTime, uu.displayName, ph.communityCards, ph.isEarlyEnd, ph.winnerHand, ph.winnerHandDescription from pokerHand ph join user uu on ph.winnerId = uu.id order by ph.id desc ;

        const pokerHands = await executeQuery(
            `SELECT ph.id,
                    ph.startTime,
                    ph.endTime,
                    u.displayName,
                    ph.communityCards,
                    ph.isEarlyEnd,
                    ph.winnerHand,
                    ph.winnerHandDescription
             FROM pokerHand ph
             JOIN user u ON ph.winnerId = u.id
             WHERE ph.startTime >= ?
             AND u.displayName LIKE ?
             ORDER BY ph.id DESC
             LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
            [fiveDaysAgo, searchPattern]
        );

        const countResult = await executeQuery(
            `SELECT COUNT(*) AS total
             FROM pokerHand ph
             JOIN user u ON ph.winnerId = u.id
             WHERE ph.startTime >= ?
             AND u.displayName LIKE ?`,
            [fiveDaysAgo, searchPattern]
        );

        return res.status(200).json({
            pokerHands,
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
