// server/utils/setupPasswords.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: One-time script to update user passwords in the database.
//
// The seed.sql file used a placeholder hash. This script generates
// REAL bcrypt hashes and updates the database correctly.
//
// HOW TO RUN (one time only):
//   node server/utils/setupPasswords.js
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const SALT_ROUNDS = 10;

// Define the correct password for each username
const accounts = [
  { username: 'admin',    password: 'admin@123'   },
  { username: 'teacher1', password: 'teacher@123' },
  { username: 'teacher2', password: 'teacher@123' },
  { username: 'student1', password: 'student@123' },
  { username: 'student2', password: 'student@123' },
  { username: 'student3', password: 'student@123' },
  { username: 'student4', password: 'student@123' },
  { username: 'student5', password: 'student@123' },
  { username: 'student6', password: 'student@123' },
];

async function setupPasswords() {
  console.log('\n🔐 Setting up passwords...\n');

  try {
    for (const account of accounts) {
      // Generate bcrypt hash
      const hash = await bcrypt.hash(account.password, SALT_ROUNDS);

      // Update in database
      const [result] = await pool.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [hash, account.username]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ ${account.username.padEnd(12)} → password set to: ${account.password}`);
      } else {
        console.log(`⚠️  ${account.username} — user not found in database`);
      }
    }

    console.log('\n✅ All passwords updated successfully!');
    console.log('\nLogin accounts:');
    console.log('  Admin:   username=admin    password=admin@123');
    console.log('  Teacher: username=teacher  (alias: teacher1) password=teacher@123');
    console.log('  Student: username=student  (alias: student1) password=student@123\n');

  } catch (error) {
    console.error('❌ Error setting up passwords:', error.message);
    console.error('   Make sure MySQL is running and database is imported.');
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setupPasswords();
