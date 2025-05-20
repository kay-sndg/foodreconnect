const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const initDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error', err);
    process.exit(1);
  }
};

module.exports = { pool, initDatabase };
