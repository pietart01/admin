// db.js
import mysql from 'mysql2/promise';

let pool;

const createPool = (isProduction) => mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: isProduction ? 10 : 5,
  queueLimit: isProduction ? 0 : 100
});

if (process.env.NODE_ENV !== 'production') {
  if (!global._mysqlPool) {
    global._mysqlPool = createPool(false);
  }
  pool = global._mysqlPool;
} else {
  pool = createPool(true);
}

export async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      query,
      params,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}