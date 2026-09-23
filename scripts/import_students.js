const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../database/google_sheet_students.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/);

const adminHash = '$2a$10$JQAyEPeBu8r1t/2T.9G3TOb7yPZs6a6d7L9FlnwgtvcJ6ccX4mxaO'; // admin@123
const teacherHash = '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO'; // teacher@123
const studentHash = '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby'; // student@123

const students = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  if (parts.length >= 6 && parts[1] && parts[1].startsWith('DUC2024-')) {
    const studentId = parts[1].trim();
    const dorm = parts[2].trim();
    const nameKh = parts[3].trim().replace(/'/g, "''");
    const nameEnRaw = parts[4].trim();
    const genderRaw = parts[5].trim();
    const telegram = (parts[6] || '').trim().replace(/'/g, "''");
    const roleInClass = (parts[7] || '').trim();

    const nameEn = nameEnRaw
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .replace(/'/g, "''");
    const username = nameEnRaw.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    const gender = genderRaw.includes('ស្រី') ? 'female' : 'male';
    const email = studentId.toLowerCase() + '@duc.edu.kh';

    students.push({
      studentId,
      nameKh,
      nameEn,
      username,
      gender,
      telegram,
      email,
      dorm,
      roleInClass
    });
  }
}

let sql = `-- =============================================================================
-- ALL 61 STUDENTS + TEACHERS + ADMIN IMPORT
-- Digital University of Cambodia · G1-NW-B (Networking & Security)
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

-- 1. CLASSES
INSERT INTO classes (id, class_code, class_name, academic_year, description) VALUES
(1, 'G1-NW-B', 'G1 Networking & Security B (ជំនាញបណ្តាញកុំព្យូទ័រ និងប្រព័ន្ធសុវត្ថិភាព B)', '2026-2027', 'ឆមាសទី១ ឆ្នាំទី៤ ជំនាន់ទី១ - Digital University of Cambodia'),
(2, 'G1-NW-A', 'G1 Networking & Security A', '2026-2027', 'Bachelor of Computer Network & Security'),
(3, 'G2-CS-A', 'G2 Computer Science A', '2026-2027', 'Faculty of Digital Industry');

-- 2. SUBJECTS
INSERT INTO subjects (id, subject_code, subject_name, description, credits) VALUES
(1, 'SAD',   'System Analyze and Design', 'System Analysis & Design (SAD) — លោកគ្រូ ឈាង វុទ្ធី', 3),
(2, 'ITPM',  'IT Project Management',     'Information Technology Project Management (ITPM) — លោកគ្រូ សែម វ៉ាវី', 3),
(3, 'CSC.V', 'Cisco V',                   'Cisco Networking V (CSC.V) — លោកគ្រូ សែម វ៉ាវី', 3),
(4, 'CA',    'Cloud Architecture',        'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ ភឿន មេសា', 3);

-- 3. USERS
INSERT INTO users (id, username, email, password, role) VALUES
-- Admin (admin / admin@123)
(1, 'admin', 'admin@duc.edu.kh', '${adminHash}', 'admin'),

-- Teachers (teacher@123)
(2, 'vuthey', 'vuthey@duc.edu.kh', '${teacherHash}', 'teacher'),
(3, 'vavy',   'vavy@duc.edu.kh',   '${teacherHash}', 'teacher'),
(4, 'mesa',   'mesa@duc.edu.kh',   '${teacherHash}', 'teacher'),

-- Student Rep: Mok Sambath (sambath / student@123)
(5, 'sambath', 'sambath@duc.edu.kh', '${studentHash}', 'student'),
`;

students.forEach((s, idx) => {
  const userId = 6 + idx;
  const comma = (idx === students.length - 1) ? ';' : ',';
  sql += `(${userId}, '${s.username}', '${s.email}', '${studentHash}', 'student')${comma}\n`;
});

sql += `\n-- 4. TEACHERS\nINSERT INTO teachers (id, user_id, teacher_id, full_name, gender, email, department) VALUES\n`;
sql += `(1, 2, 'TCH-001', 'Mr. Chheang Vuthey (ឈាង វុទ្ធី)', 'male', 'vuthey@duc.edu.kh', 'Computer Network & Security'),\n`;
sql += `(2, 3, 'TCH-002', 'Mr. Sem Vavy (សែម វ៉ាវី)',         'male', 'vavy@duc.edu.kh',   'Computer Network & Security'),\n`;
sql += `(3, 4, 'TCH-003', 'Mr. Phoeun Mesa (ភឿន មេសា)',       'male', 'mesa@duc.edu.kh',   'Cloud & Infrastructure');\n\n`;

sql += `-- 5. STUDENTS (Total ${students.length + 1} students)\nINSERT INTO students (id, user_id, student_id, full_name, full_name_kh, gender, phone, email, class_id) VALUES\n`;
sql += `(1, 5, 'DUC2024-0001', 'Mok Sambath', 'ម៉ុក សម្បត្តិ', 'male', 't.me/moksambath', 'sambath@duc.edu.kh', 1),\n`;

students.forEach((s, idx) => {
  const stuId = 2 + idx;
  const userId = 6 + idx;
  const comma = (idx === students.length - 1) ? ';' : ',';
  sql += `(${stuId}, ${userId}, '${s.studentId}', '${s.nameEn}', '${s.nameKh}', '${s.gender}', '${s.telegram}', '${s.email}', 1)${comma}\n`;
});

sql += `\n-- 6. SCHEDULES (Class G1-NW-B official timetable in Room DUC3)\nINSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES\n`;
sql += `(1, 1, 1, 'Friday',   '08:00:00', '11:00:00', 'DUC3'),  -- SAD by Chheang Vuthey\n`;
sql += `(1, 2, 2, 'Friday',   '13:00:00', '15:00:00', 'DUC3'),  -- ITPM by Sem Vavy\n`;
sql += `(1, 3, 2, 'Friday',   '15:00:00', '16:30:00', 'DUC3'),  -- CSC.V by Sem Vavy\n`;
sql += `(1, 4, 3, 'Saturday', '08:00:00', '11:00:00', 'DUC3');  -- CA by Phoeun Mesa\n\n`;

sql += `SELECT 'Import Completed Successfully!' AS Status;\n`;
sql += `SELECT COUNT(*) AS total_users FROM users;\n`;
sql += `SELECT COUNT(*) AS total_students FROM students;\n`;

fs.writeFileSync(path.resolve(__dirname, '../database/import_all_students.sql'), sql, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../database/seed.sql'), sql, 'utf8');
console.log('SUCCESS! Generated database/import_all_students.sql and updated seed.sql with ' + students.length + ' students!');
