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
    `ALTER TABLE teachers MODIFY COLUMN phone VARCHAR(100)`,
    `UPDATE teachers SET full_name = 'Mr. Koeun Mesa (គឿន មេសា)' WHERE teacher_id = 'TCH-003' OR full_name LIKE '%Phoeun Mesa%' OR full_name LIKE '%ភឿន មេសា%'`,
    `UPDATE subjects SET description = 'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ គឿន មេសា' WHERE subject_code = 'CA' OR description LIKE '%ភឿន មេសា%'`
  ];
  for (const sql of migrations) {
    try {
      await connection.query(sql);
    } catch (_) {
      // Ignore if column already exists or table not initialized yet
    }
  }

  // Auto-sync official university class timetables (G1-PG-A, G1-PG-B, G1-NW-B)
  await syncOfficialTimetables(connection);
}

async function syncOfficialTimetables(connection) {
  try {
    // 1. Classes: Ensure G1-PG-A, G1-PG-B, G1-NW-B exist
    await connection.query(`
      UPDATE classes 
      SET class_code = 'G1-PG-A', 
          class_name = 'G1 Programming A (ជំនាញអភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ A)',
          description = 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry'
      WHERE class_code = 'G1-SD-A'
    `);

    const [pgA] = await connection.query(`SELECT id FROM classes WHERE class_code = 'G1-PG-A'`);
    if (pgA.length === 0) {
      await connection.query(`
        INSERT INTO classes (class_code, class_name, academic_year, description)
        VALUES ('G1-PG-A', 'G1 Programming A (ជំនាញអភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ A)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry')
      `);
    }

    const [pgB] = await connection.query(`SELECT id FROM classes WHERE class_code = 'G1-PG-B'`);
    if (pgB.length === 0) {
      await connection.query(`
        INSERT INTO classes (class_code, class_name, academic_year, description)
        VALUES ('G1-PG-B', 'G1 Programming B (ជំនាញអភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ B)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry')
      `);
    }

    const [nwB] = await connection.query(`SELECT id FROM classes WHERE class_code = 'G1-NW-B'`);
    if (nwB.length === 0) {
      await connection.query(`
        INSERT INTO classes (class_code, class_name, academic_year, description)
        VALUES ('G1-NW-B', 'G1 Networking & Security B (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព B)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry')
      `);
    }

    // 2. Teachers: Ensure Pho Tola, Chum Darone, SAN SEN, Chheang Vuthey, Sem Vavy, Koeun Mesa
    const teacherData = [
      { code: 'TCH-001', name: 'Mr. Chheang Vuthey (ឈាង វុទ្ធី)', email: 'vuthey@duc.edu.kh', username: 'vuthey', dept: 'Computer Network & Security' },
      { code: 'TCH-002', name: 'Mr. Sem Vavy (សែម វ៉ាវី)',         email: 'vavy@duc.edu.kh',   username: 'vavy',   dept: 'Computer Network & Security' },
      { code: 'TCH-003', name: 'Mr. Koeun Mesa (គឿន មេសា)',        email: 'mesa@duc.edu.kh',   username: 'mesa',   dept: 'Cloud & Infrastructure' },
      { code: 'TCH-004', name: 'Mr. Pho Tola (ភ តុលា)',           email: 'tola@duc.edu.kh',   username: 'tola',   dept: 'Software Development' },
      { code: 'TCH-005', name: 'Mr. Chum Darone (ជុំ ដារ៉ូណែ)',     email: 'darone@duc.edu.kh', username: 'darone', dept: 'Software Development' },
      { code: 'TCH-006', name: 'SAN SEN (សាន សែន)',               email: 'sansen@duc.edu.kh', username: 'sansen', dept: 'E-Commerce' }
    ];

    const teacherHash = '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO';

    for (const t of teacherData) {
      let [u] = await connection.query(`SELECT id FROM users WHERE username = ? OR email = ?`, [t.username, t.email]);
      let userId;
      if (u.length === 0) {
        const [uRes] = await connection.query(
          `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'teacher')`,
          [t.username, t.email, teacherHash]
        );
        userId = uRes.insertId;
      } else {
        userId = u[0].id;
      }

      let [tch] = await connection.query(`SELECT id FROM teachers WHERE teacher_id = ? OR full_name LIKE ?`, [t.code, `%${t.name.split(' ')[1]}%`]);
      if (tch.length === 0) {
        await connection.query(
          `INSERT INTO teachers (user_id, teacher_id, full_name, gender, email, department) VALUES (?, ?, ?, 'male', ?, ?)`,
          [userId, t.code, t.name, t.email, t.dept]
        );
      } else {
        await connection.query(
          `UPDATE teachers SET full_name = ?, email = ?, department = ? WHERE id = ?`,
          [t.name, t.email, t.dept, tch[0].id]
        );
      }
    }

    // 3. Subjects: MAF.II, SPD.II, E-C, CTN, SAD, ITPM, CSC.V, CA
    const subjectData = [
      { code: 'MAF.II', name: 'Mobile Application Framework II', desc: 'Mobile Application Framework II — លោកគ្រូ ភ តុលា', credits: 3 },
      { code: 'SPD.II', name: 'Software Project Development II', desc: 'Software Project Development II — លោកគ្រូ ជុំ ដារ៉ូណែ', credits: 3 },
      { code: 'E-C',    name: 'E-Commerce',                      desc: 'E-Commerce — SAN SEN', credits: 3 },
      { code: 'CTN',    name: 'Containers',                      desc: 'Containers — លោកគ្រូ គឿន មេសា', credits: 3 },
      { code: 'SAD',    name: 'System Analyze and Design',       desc: 'System Analysis & Design (SAD) — លោកគ្រូ ឈាង វុទ្ធី', credits: 3 },
      { code: 'ITPM',   name: 'IT Project Management',           desc: 'Information Technology Project Management (ITPM) — លោកគ្រូ សែម វ៉ាវី', credits: 3 },
      { code: 'CSC.V',  name: 'Cisco V',                         desc: 'Cisco Networking V (CSC.V) — លោកគ្រូ សែម វ៉ាវី', credits: 3 },
      { code: 'CA',     name: 'Cloud Architecture',              desc: 'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ គឿន មេសា', credits: 3 }
    ];

    for (const s of subjectData) {
      const [sub] = await connection.query(`SELECT id FROM subjects WHERE subject_code = ?`, [s.code]);
      if (sub.length === 0) {
        await connection.query(
          `INSERT INTO subjects (subject_code, subject_name, description, credits) VALUES (?, ?, ?, ?)`,
          [s.code, s.name, s.desc, s.credits]
        );
      } else {
        await connection.query(
          `UPDATE subjects SET subject_name = ?, description = ? WHERE id = ?`,
          [s.name, s.desc, sub[0].id]
        );
      }
    }

    // 4. Clean and re-seed schedules for G1-PG-A, G1-PG-B, G1-NW-B
    const [cRows] = await connection.query(`SELECT id, class_code FROM classes`);
    const cMap = {};
    cRows.forEach(r => { cMap[r.class_code] = r.id; });

    const [sRows] = await connection.query(`SELECT id, subject_code FROM subjects`);
    const sMap = {};
    sRows.forEach(r => { sMap[r.subject_code] = r.id; });

    const [tRows] = await connection.query(`SELECT id, teacher_id, full_name FROM teachers`);
    const tMap = {};
    tRows.forEach(r => {
      tMap[r.teacher_id] = r.id;
      if (r.full_name.includes('Tola') || r.full_name.includes('តុលា')) tMap['TOLA'] = r.id;
      if (r.full_name.includes('Darone') || r.full_name.includes('ដារ៉ូណែ')) tMap['DARONE'] = r.id;
      if (r.full_name.includes('SAN SEN') || r.full_name.includes('សែន')) tMap['SANSEN'] = r.id;
      if (r.full_name.includes('Vuthey') || r.full_name.includes('វុទ្ធី')) tMap['VUTHEY'] = r.id;
      if (r.full_name.includes('Vavy') || r.full_name.includes('វ៉ាវី')) tMap['VAVY'] = r.id;
      if (r.full_name.includes('Mesa') || r.full_name.includes('មេសា')) tMap['MESA'] = r.id;
    });

    const targetClasses = [cMap['G1-PG-A'], cMap['G1-PG-B'], cMap['G1-NW-B']].filter(Boolean);
    if (targetClasses.length > 0) {
      await connection.query(`DELETE FROM schedules WHERE class_id IN (${targetClasses.join(',')})`);
    }

    const officialSchedules = [];

    // G1-PG-A
    if (cMap['G1-PG-A']) {
      const cid = cMap['G1-PG-A'];
      officialSchedules.push(
        [cid, sMap['MAF.II'], tMap['TOLA']   || tMap['TCH-004'], 'Saturday', '13:00:00', '17:00:00', 'DUC1'],
        [cid, sMap['SPD.II'], tMap['DARONE'] || tMap['TCH-005'], 'Sunday',   '07:00:00', '10:00:00', 'DUC1'],
        [cid, sMap['E-C'],    tMap['SANSEN'] || tMap['TCH-006'], 'Sunday',   '10:00:00', '12:00:00', 'DUC1'],
        [cid, sMap['E-C'],    tMap['SANSEN'] || tMap['TCH-006'], 'Sunday',   '13:00:00', '15:00:00', 'DUC1'],
        [cid, sMap['CTN'],    tMap['MESA']   || tMap['TCH-003'], 'Sunday',   '17:30:00', '20:30:00', 'DUC1']
      );
    }

    // G1-PG-B
    if (cMap['G1-PG-B']) {
      const cid = cMap['G1-PG-B'];
      officialSchedules.push(
        [cid, sMap['MAF.II'], tMap['TOLA']   || tMap['TCH-004'], 'Saturday', '08:00:00', '12:00:00', 'DUC2'],
        [cid, sMap['CTN'],    tMap['MESA']   || tMap['TCH-003'], 'Saturday', '17:30:00', '20:30:00', 'DUC2'],
        [cid, sMap['E-C'],    tMap['SANSEN'] || tMap['TCH-006'], 'Sunday',   '07:00:00', '10:00:00', 'DUC2'],
        [cid, sMap['SPD.II'], tMap['DARONE'] || tMap['TCH-005'], 'Sunday',   '10:00:00', '12:00:00', 'DUC2'],
        [cid, sMap['SPD.II'], tMap['DARONE'] || tMap['TCH-005'], 'Sunday',   '15:00:00', '17:00:00', 'DUC1']
      );
    }

    // G1-NW-B
    if (cMap['G1-NW-B']) {
      const cid = cMap['G1-NW-B'];
      officialSchedules.push(
        [cid, sMap['SAD'],   tMap['VUTHEY'] || tMap['TCH-001'], 'Friday',   '08:00:00', '11:00:00', 'DUC3'],
        [cid, sMap['ITPM'],  tMap['VAVY']   || tMap['TCH-002'], 'Friday',   '13:00:00', '15:00:00', 'DUC3'],
        [cid, sMap['CSC.V'], tMap['VAVY']   || tMap['TCH-002'], 'Friday',   '15:00:00', '16:30:00', 'DUC3'],
        [cid, sMap['CA'],    tMap['MESA']   || tMap['TCH-003'], 'Saturday', '08:00:00', '11:00:00', 'DUC3']
      );
    }

    for (const item of officialSchedules) {
      if (item[0] && item[1] && item[2]) {
        await connection.query(
          `INSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          item
        );
      }
    }

    console.log('✅ Official University Schedules auto-synced for G1-PG-A, G1-PG-B, G1-NW-B');
  } catch (err) {
    console.error('⚠️ Timetable auto-sync error:', err.message);
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
