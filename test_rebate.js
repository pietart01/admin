const {executeQuery} = require("./config/database");
const { redisWrapper } = require('./RedisWrapper');

const REBATE_CACHE_PREFIX = 'user:*:game:*:effectiveAncestors';

async function flushRebateCache() {
    try {
        // Use the SCAN command to iterate over keys
        let cursor = '0';
        do {
            const [newCursor, keys] = await redisWrapper.withClient(client =>
                client.scan(cursor, 'MATCH', REBATE_CACHE_PREFIX, 'COUNT', 100)
            );
            cursor = newCursor;

            if (keys.length > 0) {
                await redisWrapper.withClient(client => client.del(...keys));
                console.log(`Deleted ${keys.length} rebate cache keys.`);
            }
        } while (cursor !== '0');

        console.log('Rebate cache flushed successfully.');
    } catch (error) {
        console.error('Error flushing rebate cache:', error);
    }
}


async function flushRebateData(gameCategoryId) {
    const query = `
    DELETE FROM userRebateSetting WHERE gameCategoryId = ?;
    UPDATE rebateConfiguration SET maxTotalRollingRebate = 1.00, maxTotalLosingRebate = 5.00 WHERE gameCategoryId = ?;
  `;
    await executeQuery(query, [gameCategoryId, gameCategoryId]);
    console.log(`Flushed rebate data for gameCategoryId: ${gameCategoryId}`);
}

async function insertTestRebateData(gameCategoryId) {
    const query = `
    INSERT INTO userRebateSetting (userId, childUserId, gameCategoryId, rollingRebatePercentage, losingRebatePercentage)
    VALUES 
    (7, 8, ?, 0.90, 4.50),   -- rebate0 gives 0.90% rolling and 4.50% losing to rebate00
    (7, 14, ?, 0.90, 4.50),   -- rebate0 gives 0.90% rolling and 4.50% losing to rebate00
    (8, 12, ?, 0.60, 3.00),
    (8, 13, ?, 0.10, 3.00)
    ;  -- rebate00 gives 0.60% rolling and 3.00% losing to rebate001
  `;
    try {
        await executeQuery(query, [gameCategoryId, gameCategoryId, gameCategoryId, gameCategoryId]);
        console.log(`Inserted test rebate data for gameCategoryId: ${gameCategoryId}`);
    } catch (error) {
        console.error('Error inserting test data:', error);
        throw error;
    }
}


async function getEffectiveAncestorsWithRebates(userId, gameCategoryId) {
    const query = `
    WITH RECURSIVE userHierarchy AS (
      SELECT 
        u.id AS userId,
        u.parentUserId,
        u.level,
        COALESCE(urs.rollingRebatePercentage, 0) AS rollingRebatePercentage,
        COALESCE(urs.losingRebatePercentage, 0) AS losingRebatePercentage
      FROM user u
      LEFT JOIN userRebateSetting urs ON u.parentUserId = urs.userId AND u.id = urs.childUserId AND urs.gameCategoryId = ?
      WHERE u.id = ?
      
      UNION ALL
      
      SELECT 
        u.id,
        u.parentUserId,
        u.level,
        COALESCE(urs.rollingRebatePercentage, 0) AS rollingRebatePercentage,
        COALESCE(urs.losingRebatePercentage, 0) AS losingRebatePercentage
      FROM user u
      INNER JOIN userHierarchy uh ON u.id = uh.parentUserId
      LEFT JOIN userRebateSetting urs ON u.parentUserId = urs.userId AND u.id = urs.childUserId AND urs.gameCategoryId = ?
    )
    SELECT 
      uh.userId,
      uh.parentUserId,
      uh.level,
      uh.rollingRebatePercentage,
      uh.losingRebatePercentage,
      rc.maxTotalRollingRebate,
      rc.maxTotalLosingRebate
    FROM userHierarchy uh
    CROSS JOIN rebateConfiguration rc
    WHERE rc.gameCategoryId = ?
    ORDER BY uh.level DESC;
  `;

    try {
        const rows = await executeQuery(query, [gameCategoryId, userId, gameCategoryId, gameCategoryId]);

        if (rows.length === 0) {
            return [];
        }

        const maxTotalRollingRebate = Number(rows[0].maxTotalRollingRebate);
        const maxTotalLosingRebate = Number(rows[0].maxTotalLosingRebate);

        console.log('maxTotalRollingRebate', maxTotalRollingRebate);
        console.log('maxTotalLosingRebate', maxTotalLosingRebate);

        const result = [];
        let directChildRollingRebate = 0;
        let directChildLosingRebate = 0;

        for (let i = 0; i < rows.length; i++) {
            const currentUser = rows[i];
            const receivedRollingRebate = Number(currentUser.rollingRebatePercentage);
            const receivedLosingRebate = Number(currentUser.losingRebatePercentage);

            let effectiveRollingRebate, effectiveLosingRebate;

            if (i === 0) {
                // This is the leaf node
                effectiveRollingRebate = receivedRollingRebate;
                effectiveLosingRebate = receivedLosingRebate;
            } else if (i === rows.length - 1) {
                // This is the root node
                effectiveRollingRebate = maxTotalRollingRebate - directChildRollingRebate;
                effectiveLosingRebate = maxTotalLosingRebate - directChildLosingRebate;
            } else {
                // This is an intermediate node
                effectiveRollingRebate = receivedRollingRebate - directChildRollingRebate;
                effectiveLosingRebate = receivedLosingRebate - directChildLosingRebate;
            }

            result.unshift({
                userId: currentUser.userId,
                level: currentUser.level,
                effectiveRollingRebate: Number(effectiveRollingRebate.toFixed(2)),
                effectiveLosingRebate: Number(effectiveLosingRebate.toFixed(2))
            });

            directChildRollingRebate = receivedRollingRebate;
            directChildLosingRebate = receivedLosingRebate;
        }

        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function main() {
    const userId = 12; // rebate001
    const gameCategoryId = 1;

    try {
        // Flush Redis cache
        await flushRebateCache();

        // Flush and reset database rebate data
        await flushRebateData(gameCategoryId);
        await insertTestRebateData(gameCategoryId);

        const effectiveAncestors = await getEffectiveAncestorsWithRebates(userId, gameCategoryId);
        console.log(`Effective ancestors with rebates for user ${userId} and game ${gameCategoryId}:`, effectiveAncestors);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
