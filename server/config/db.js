// server/config/db.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Configure and manage the MySQL database connection pool.
// ─────────────────────────────────────────────────────────────────────────────

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const pool = mysql.createPool({
  host:              process.env.DB_HOST     || 'localhost',
  port:              process.env.DB_PORT     || 3306,
  user:              process.env.DB_USER     || 'root',
  password:          process.env.DB_PASSWORD || '',
  database:          process.env.DB_NAME     || 'classroom_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Return dates as strings (not JS Date objects) — easier to work with
  dateStrings:        true,
  // SSL support for TiDB Cloud / production (set DB_SSL=true in .env)
  ...(process.env.DB_SSL === 'true' && {
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  })
});

// ─── Test Connection & Auto-Migrate ──────────────────────────────────────────
async function autoMigrate(connection) {
  const migrations = [
    `ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_name VARCHAR(255) NULL`,
    `ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_size INT UNSIGNED NULL`,
    `ALTER TABLE resources MODIFY COLUMN resource_type VARCHAR(50) DEFAULT 'document'`,
    `ALTER TABLE students MODIFY COLUMN phone VARCHAR(100)`,
    `ALTER TABLE teachers MODIFY COLUMN phone VARCHAR(100)`
  ];
  for (const sql of migrations) {
    try {
      await connection.query(sql);
    } catch (_) {
      // Ignore if column already exists or table not initialized yet
    }
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully to:', process.env.DB_NAME || 'classroom_db');
    await autoMigrate(connection);
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️  Database not connected:', error.message);
    console.warn('    → Run database/schema.sql and database/seed.sql first');
    return false;
  }
}

// ─── Helper: Run a query safely ───────────────────────────────────────────────
// Usage: const [rows] = await query('SELECT * FROM users WHERE id = ?', [1]);
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, testConnection, query };
