import pool from '@/lib/db';
import { executeQuery } from '@/lib/db';
import { ITEMS_PER_PAGE } from '@/constants/constants';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getPokerPots(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getPokerPots(req, res) {
    const { pokerHandId } = req.query;
    if (!pokerHandId) {
        return res.status(400).json({ message: 'Poker hand ID is required' });
    }
    try {
        // todo : add query and add pokerHand, pokerHandPlayer to return object
        // select ph.id as id, ph.startTime, ph.endTime, uu.displayName, ph.communityCards, ph.isEarlyEnd, ph.winnerHand, ph.winnerHandDescription from pokerHand ph join user uu on ph.winnerId = uu.id where ph.id = 1;
        // select php.startingStack, php.endingStack, php.holeCards, php.seatIndex, php.userId, php.isWinner, uu.displayName from pokerHandPlayer php join user uu on php.userId = uu.id where pokerHandId = 1;

        const pokerHands = await executeQuery(
            `SELECT 
                ph.id,
                ph.startTime,
                ph.endTime,
                uu.displayName as winnerName,
                ph.communityCards,
                ph.isEarlyEnd,
                ph.winnerHand,
                ph.winnerHandDescription
            FROM pokerHand ph
            JOIN user uu ON ph.winnerId = uu.id
            WHERE ph.id = ?`,
            [pokerHandId]
        );

        // Get player details
        const players = await executeQuery(
            `SELECT 
                php.startingStack,
                php.endingStack,
                php.holeCards,
                php.seatIndex,
                php.userId,
                php.isWinner,
                uu.displayName
            FROM pokerHandPlayer php
            JOIN user uu ON php.userId = uu.id
            WHERE php.pokerHandId = ?`,
            [pokerHandId]
        );

        // Get pot actions
        const pokerPots = await executeQuery(
            `SELECT 
                php.round,
                php.actionType,
                php.playerId,
                uu.displayName,
                php.amount,
                php.oldPot,
                php.newPot,
                php.createdAt
            FROM pokerHandPot php
            JOIN user AS uu ON uu.id = php.playerId
            WHERE php.pokerHandId = ?
            ORDER BY php.id ASC`,
            [pokerHandId]
        );

        return res.status(200).json({
            pokerHand: pokerHands[0], // Single hand details
            players, // Array of players
            pokerPots, // Array of pot actions
        });
    } catch (error) {
        console.error('Error fetching spins:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
