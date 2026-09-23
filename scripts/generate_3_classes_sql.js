const fs = require('fs');
const path = require('path');

const studentHash = '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby'; // student@123
const adminHash   = '$2a$10$JQAyEPeBu8r1t/2T.9G3TOb7yPZs6a6d7L9FlnwgtvcJ6ccX4mxaO'; // admin@123
const teacherHash = '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO'; // teacher@123

const classConfigs = [
  {
    gid: '70146045',
    classId: 1,
    code: 'G1-NW-B',
    name: 'G1 Networking & Security B (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព B)'
  },
  {
    gid: '124799847',
    classId: 2,
    code: 'G1-NW-A',
    name: 'G1 Networking & Security A (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព A)'
  },
  {
    gid: '1752201142',
    classId: 3,
    code: 'G1-SD-A',
    name: 'G1 Software Development A (ជំនាញអភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ A)'
  }
];

const allStudents = [];
const seenUsernames = new Set();
const seenEmails = new Set();
const seenStudentIds = new Set();

// Add admin & teachers to reserved usernames
['admin', 'vuthey', 'vavy', 'mesa', 'sambath'].forEach(u => seenUsernames.add(u));

for (const cfg of classConfigs) {
  const file = path.resolve(__dirname, `../database/sheet_${cfg.gid}.csv`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());

  let classCount = 0;
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 6 && parts[1] && parts[1].trim().startsWith('DUC2024-')) {
      const studentId = parts[1].trim();
      const dorm = parts[2].trim();
      const nameKh = parts[3].trim().replace(/'/g, "''");
      const nameEnRaw = parts[4].trim();
      const genderRaw = parts[5].trim();
      
      let telegram = '';
      let dob = null;

      // Handle GID 124799847 format which has DOB
      if (cfg.gid === '124799847') {
        const rawDob = parts[6] ? parts[6].trim() : '';
        telegram = parts[7] ? parts[7].trim().replace(/'/g, "''") : '';
      } else {
        telegram = parts[6] ? parts[6].trim().replace(/'/g, "''") : '';
      }

      const nameEn = nameEnRaw
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
        .replace(/'/g, "''");

      let baseUsername = nameEnRaw.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
      if (!baseUsername) baseUsername = studentId.toLowerCase().replace(/-/g, '_');

      let username = baseUsername;
      let counter = 1;
      while (seenUsernames.has(username)) {
        username = `${baseUsername}_${studentId.slice(-4)}`;
        if (seenUsernames.has(username)) {
          username = `${baseUsername}_${counter++}`;
        }
      }
      seenUsernames.add(username);

      const gender = genderRaw.includes('ស្រី') ? 'female' : 'male';
      const email = `${studentId.toLowerCase()}@duc.edu.kh`;

      allStudents.push({
        classId: cfg.classId,
        studentId,
        nameKh,
        nameEn,
        username,
        gender,
        telegram,
        email,
        dorm
      });
      classCount++;
    }
  }
  console.log(`Class ${cfg.code} (ID: ${cfg.classId}): ${classCount} students`);
}

console.log(`Total students across all 3 classes: ${allStudents.length}`);

// Generate SQL
let sql = `-- =============================================================================
-- ALL 3 CLASSES + STUDENTS IMPORT (${allStudents.length} Students)
-- Digital University of Cambodia
-- =============================================================================

USE classroom_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE resources; 
TRUNCATE TABLE assignments;
TRUNCATE TABLE attendance; 
TRUNCATE TABLE schedules;
TRUNCATE TABLE students; 
TRUNCATE TABLE teachers;
TRUNCATE TABLE subjects; 
TRUNCATE TABLE classes; 
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. CLASSES (ទាំង ៣ ថ្នាក់)
INSERT INTO classes (id, class_code, class_name, academic_year, description) VALUES
(1, 'G1-NW-B', 'G1 Networking & Security B (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព B)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry'),
(2, 'G1-NW-A', 'G1 Networking & Security A (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព A)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry'),
(3, 'G1-SD-A', 'G1 Software Development A (ជំនាញអភិវឌ្ឍន៍កម្មវិធីសហ្វវែរ A)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Faculty of Digital Industry');

-- 2. SUBJECTS
INSERT INTO subjects (id, subject_code, subject_name, description, credits) VALUES
(1, 'SAD',   'System Analyze and Design', 'System Analysis & Design (SAD) — លោកគ្រូ ឈាង វុទ្ធី', 3),
(2, 'ITPM',  'IT Project Management',     'Information Technology Project Management (ITPM) — លោកគ្រូ សែម វ៉ាវី', 3),
(3, 'CSC.V', 'Cisco V',                   'Cisco Networking V (CSC.V) — លោកគ្រូ សែម វ៉ាវី', 3),
(4, 'CA',    'Cloud Architecture',        'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ ភឿន មេសា', 3);

-- 3. USERS (Admin + Teachers + Sambath + ${allStudents.length} Students)
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin',   'admin@duc.edu.kh',   '${adminHash}',   'admin'),
(2, 'vuthey',  'vuthey@duc.edu.kh',  '${teacherHash}', 'teacher'),
(3, 'vavy',    'vavy@duc.edu.kh',    '${teacherHash}', 'teacher'),
(4, 'mesa',    'mesa@duc.edu.kh',    '${teacherHash}', 'teacher'),
(5, 'sambath', 'sambath@duc.edu.kh', '${studentHash}', 'student'),
`;

allStudents.forEach((s, idx) => {
  const userId = 6 + idx;
  const comma = (idx === allStudents.length - 1) ? ';' : ',';
  sql += `(${userId}, '${s.username}', '${s.email}', '${studentHash}', 'student')${comma}\n`;
});

sql += `\n-- 4. TEACHERS\nINSERT INTO teachers (id, user_id, teacher_id, full_name, gender, email, department) VALUES\n`;
sql += `(1, 2, 'TCH-001', 'Mr. Chheang Vuthey (ឈាង វុទ្ធី)', 'male', 'vuthey@duc.edu.kh', 'Computer Network & Security'),\n`;
sql += `(2, 3, 'TCH-002', 'Mr. Sem Vavy (សែម វ៉ាវី)',         'male', 'vavy@duc.edu.kh',   'Computer Network & Security'),\n`;
sql += `(3, 4, 'TCH-003', 'Mr. Phoeun Mesa (ភឿន មេសា)',       'male', 'mesa@duc.edu.kh',   'Cloud & Infrastructure');\n\n`;

sql += `-- 5. STUDENTS (${allStudents.length + 1} Total)\nINSERT INTO students (id, user_id, student_id, full_name, full_name_kh, gender, phone, email, class_id) VALUES\n`;
sql += `(1, 5, 'DUC2024-0001', 'Mok Sambath', 'ម៉ុក សម្បត្តិ', 'male', 't.me/moksambath', 'sambath@duc.edu.kh', 1),\n`;

allStudents.forEach((s, idx) => {
  const stuId = 2 + idx;
  const userId = 6 + idx;
  const comma = (idx === allStudents.length - 1) ? ';' : ',';
  sql += `(${stuId}, ${userId}, '${s.studentId}', '${s.nameEn}', '${s.nameKh}', '${s.gender}', '${s.telegram}', '${s.email}', ${s.classId})${comma}\n`;
});

sql += `\n-- 6. SCHEDULES (Class Timetables)\nINSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES\n`;
// G1-NW-B
sql += `(1, 1, 1, 'Friday',   '08:00:00', '11:00:00', 'DUC3'),\n`;
sql += `(1, 2, 2, 'Friday',   '13:00:00', '15:00:00', 'DUC3'),\n`;
sql += `(1, 3, 2, 'Friday',   '15:00:00', '16:30:00', 'DUC3'),\n`;
sql += `(1, 4, 3, 'Saturday', '08:00:00', '11:00:00', 'DUC3'),\n`;
// G1-NW-A
sql += `(2, 1, 1, 'Monday',   '08:00:00', '11:00:00', 'DUC1'),\n`;
sql += `(2, 2, 2, 'Monday',   '13:00:00', '15:00:00', 'DUC1'),\n`;
sql += `(2, 3, 2, 'Tuesday',  '08:00:00', '11:00:00', 'DUC1'),\n`;
sql += `(2, 4, 3, 'Wednesday','08:00:00', '11:00:00', 'DUC1'),\n`;
// G1-SD-A
sql += `(3, 1, 1, 'Thursday', '08:00:00', '11:00:00', 'DUC2'),\n`;
sql += `(3, 2, 2, 'Thursday', '13:00:00', '15:00:00', 'DUC2'),\n`;
sql += `(3, 4, 3, 'Saturday', '13:00:00', '16:00:00', 'DUC2');\n\n`;

sql += `SELECT 'Import of All 3 Classes Completed Successfully!' AS Status;\n`;
sql += `SELECT c.class_code, c.class_name, COUNT(s.id) AS total_students FROM classes c LEFT JOIN students s ON s.class_id = c.id GROUP BY c.id;\n`;
sql += `SELECT COUNT(*) AS total_users FROM users;\n`;

fs.writeFileSync(path.resolve(__dirname, '../database/import_all_3_classes.sql'), sql, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../database/seed.sql'), sql, 'utf8');
console.log('SUCCESS! Generated database/import_all_3_classes.sql and updated seed.sql!');
