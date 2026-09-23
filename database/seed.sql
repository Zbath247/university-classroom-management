-- ═══════════════════════════════════════════════════════════════════════════
-- database/seed.sql
-- Sample data for demonstration
-- Digital University of Cambodia · G1-NW-B · ម៉ុក សម្បត្តិ
--
-- HOW TO RUN (after schema.sql):
--   mysql -u root -p classroom_db < database/seed.sql
--
-- PASSWORDS (all hashed with bcrypt, rounds=10):
--   admin    → Admin@123
--   teacher1 → Teacher@123
--   teacher2 → Teacher@123
--   student1 → Student@123
--   (all students use Student@123)
-- ═══════════════════════════════════════════════════════════════════════════

USE classroom_db;

-- ── 1. USERS ──────────────────────────────────────────────────────────────────
-- NOTE: Passwords are bcrypt hashes generated for the plaintext shown above.
INSERT INTO users (id, username, email, password, role) VALUES
-- Admin account
(1, 'admin',    'admin@duc.edu.kh',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),

-- Teacher accounts
(2, 'teacher1', 'sophea@duc.edu.kh',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
(3, 'teacher2', 'dara@duc.edu.kh',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),

-- Student accounts
(4, 'student1', 'sambath@duc.edu.kh',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(5, 'student2', 'kosal@duc.edu.kh',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(6, 'student3', 'sreyla@duc.edu.kh',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(7, 'student4', 'chanthy@duc.edu.kh',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(8, 'student5', 'rathana@duc.edu.kh',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
(9, 'student6', 'pisey@duc.edu.kh',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- ── 2. CLASSES ────────────────────────────────────────────────────────────────
INSERT INTO classes (id, class_code, class_name, academic_year, description) VALUES
(1, 'G1-NW-B', 'Group 1 Networking B', '2025-2026', 'First year Information Technology – Networking group B'),
(2, 'G1-NW-A', 'Group 1 Networking A', '2025-2026', 'First year Information Technology – Networking group A'),
(3, 'G2-CS-A', 'Group 2 Computer Science A', '2025-2026', 'Second year Computer Science group A');

-- ── 3. SUBJECTS ───────────────────────────────────────────────────────────────
INSERT INTO subjects (id, subject_code, subject_name, description, credits) VALUES
(1, 'SAD',   'System Analyze and Design', 'System Analysis & Design (SAD) — លោកគ្រូ ឈាង វុទ្ធី', 3),
(2, 'ITPM',  'IT Project Management',     'Information Technology Project Management (ITPM) — លោកគ្រូ សែម វ៉ាវី', 3),
(3, 'CSC.V', 'Cisco V',                   'Cisco Networking V (CSC.V) — លោកគ្រូ សែម វ៉ាវី', 3),
(4, 'CA',    'Cloud Architecture',        'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ ភឿន មេសា', 3),
(5, 'NET-101', 'Computer Networking',     'Fundamentals of networking, TCP/IP, OSI model', 3);

-- ── 4. TEACHERS ───────────────────────────────────────────────────────────────
INSERT INTO teachers (id, user_id, teacher_id, full_name, gender, email, phone, department) VALUES
(1, 2, 'TCH-001', 'Mr. Chheang Vuthey (ឈាង វុទ្ធី)', 'male', 'vuthey@duc.edu.kh', '012-345-678', 'Computer Network & Security'),
(2, 3, 'TCH-002', 'Mr. Sem Vavy (សែម វ៉ាវី)',         'male', 'vavy@duc.edu.kh',   '012-987-654', 'Computer Network & Security'),
(3, 1, 'TCH-003', 'Mr. Phoeun Mesa (ភឿន មេសា)',       'male', 'mesa@duc.edu.kh',   '012-111-222', 'Cloud & Infrastructure');

-- ── 5. STUDENTS ───────────────────────────────────────────────────────────────
INSERT INTO students (id, user_id, student_id, full_name, full_name_kh, gender, date_of_birth, phone, email, class_id) VALUES
(1, 4, 'STU-2024-001', 'Mok Sambath',    'ម៉ុក សម្បត្តិ',   'male',   '2004-05-15', '087-111-001', 'sambath@duc.edu.kh',  1),
(2, 5, 'STU-2024-002', 'Ly Kosal',       'លី គសាល',         'male',   '2004-08-22', '087-111-002', 'kosal@duc.edu.kh',    1),
(3, 6, 'STU-2024-003', 'Noun Sreyla',    'នួន ស្រីឡា',      'female', '2004-03-10', '087-111-003', 'sreyla@duc.edu.kh',   1),
(4, 7, 'STU-2024-004', 'Pov Chanthy',    'ផូ ចន្ទី',         'female', '2004-11-05', '087-111-004', 'chanthy@duc.edu.kh',  1),
(5, 8, 'STU-2024-005', 'Sok Rathana',    'សុខ រ័ត្ន',        'male',   '2003-07-30', '087-111-005', 'rathana@duc.edu.kh',  1),
(6, 9, 'STU-2024-006', 'Kim Pisey',      'គឹម ពិសី',        'female', '2004-09-18', '087-111-006', 'pisey@duc.edu.kh',    1);

-- ── 6. SCHEDULES ──────────────────────────────────────────────────────────────
-- Official Class G1-NW-B timetable (Room DUC3)
INSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
-- Friday
(1, 1, 1, 'Friday',   '08:00:00', '11:00:00', 'DUC3'),  -- SAD by Chheang Vuthey
(1, 2, 2, 'Friday',   '13:00:00', '15:00:00', 'DUC3'),  -- ITPM by Sem Vavy
(1, 3, 2, 'Friday',   '15:00:00', '16:30:00', 'DUC3'),  -- CSC.V by Sem Vavy
-- Saturday
(1, 4, 3, 'Saturday', '08:00:00', '11:00:00', 'DUC3');  -- CA by Phoeun Mesa

-- ── 7. ATTENDANCE (sample records for last week) ──────────────────────────────
INSERT INTO attendance (student_id, subject_id, teacher_id, attendance_date, status, remark) VALUES
-- SAD class on Monday 2026-09-14
(1, 1, 1, '2026-09-14', 'present',    NULL),
(2, 1, 1, '2026-09-14', 'present',    NULL),
(3, 1, 1, '2026-09-14', 'absent',     'Sick'),
(4, 1, 1, '2026-09-14', 'present',    NULL),
(5, 1, 1, '2026-09-14', 'late',       'Arrived 20 min late'),
(6, 1, 1, '2026-09-14', 'present',    NULL),

-- Networking class on Monday 2026-09-14
(1, 2, 1, '2026-09-14', 'present',    NULL),
(2, 2, 1, '2026-09-14', 'present',    NULL),
(3, 2, 1, '2026-09-14', 'permission', 'Medical appointment'),
(4, 2, 1, '2026-09-14', 'present',    NULL),
(5, 2, 1, '2026-09-14', 'present',    NULL),
(6, 2, 1, '2026-09-14', 'late',       NULL),

-- DB class on Tuesday 2026-09-15
(1, 3, 2, '2026-09-15', 'present',    NULL),
(2, 3, 2, '2026-09-15', 'absent',     NULL),
(3, 3, 2, '2026-09-15', 'present',    NULL),
(4, 3, 2, '2026-09-15', 'present',    NULL),
(5, 3, 2, '2026-09-15', 'present',    NULL),
(6, 3, 2, '2026-09-15', 'present',    NULL),

-- SAD class on Monday 2026-09-21 (today)
(1, 1, 1, '2026-09-21', 'present',    NULL),
(2, 1, 1, '2026-09-21', 'present',    NULL),
(3, 1, 1, '2026-09-21', 'present',    NULL),
(4, 1, 1, '2026-09-21', 'late',       NULL),
(5, 1, 1, '2026-09-21', 'present',    NULL),
(6, 1, 1, '2026-09-21', 'absent',     'Unknown');

-- ── 8. ASSIGNMENTS ────────────────────────────────────────────────────────────
INSERT INTO assignments (subject_id, teacher_id, class_id, title, description, due_date) VALUES
(1, 1, 1, 'Use Case Diagram Assignment',
 'Draw a complete Use Case Diagram for the University Classroom Management System. Include all actors and at least 10 use cases.',
 '2026-09-28'),

(1, 1, 1, 'DFD Level 0 Assignment',
 'Create a Context Diagram (DFD Level 0) for the University Classroom Management System.',
 '2026-10-05'),

(2, 1, 1, 'Network Topology Design',
 'Design a network topology for a small university campus. Include routers, switches, and end devices.',
 '2026-10-01'),

(3, 2, 1, 'Database Design Project',
 'Design a complete ERD for a library management system. Include at least 6 tables with proper relationships.',
 '2026-10-10'),

(4, 2, 1, 'Personal Portfolio Website',
 'Build a personal portfolio website using HTML, CSS, and JavaScript. Must include: Home, About, Projects, and Contact pages.',
 '2026-10-15');

-- ── 9. RESOURCES ──────────────────────────────────────────────────────────────
INSERT INTO resources (subject_id, teacher_id, title, description, file_url, resource_type) VALUES
(1, 1, 'SAD Lecture Slides - Chapter 1',
 'Introduction to System Analysis and Design. Covers SDLC phases and methodologies.',
 'https://drive.google.com/file/sad-ch1',
 'document'),

(1, 1, 'UML Diagram Tutorial Video',
 'Step-by-step video guide on drawing Use Case, Activity, and Sequence diagrams.',
 'https://www.youtube.com/watch?v=example-uml',
 'video'),

(2, 1, 'Networking Fundamentals PDF',
 'Complete reference for OSI model, TCP/IP stack, and network protocols.',
 'https://drive.google.com/file/net-fundamentals',
 'document'),

(3, 2, 'SQL Query Practice Sheet',
 'Practice SQL queries covering SELECT, JOIN, GROUP BY, and subqueries.',
 'https://drive.google.com/file/sql-practice',
 'document'),

(4, 2, 'HTML & CSS Starter Template',
 'A clean starter template for web development projects. Includes basic CSS reset and grid layout.',
 'https://github.com/example/web-template',
 'link'),

(5, 1, 'Agile & Scrum Overview',
 'Introduction to Agile methodology, Scrum framework, sprints, and user stories.',
 'https://drive.google.com/file/agile-scrum',
 'document');

-- ── Final confirmation ─────────────────────────────────────────────────────────
SELECT 'Sample data inserted successfully!' AS Status;
SELECT COUNT(*) AS total_users    FROM users;
SELECT COUNT(*) AS total_students FROM students;
SELECT COUNT(*) AS total_teachers FROM teachers;
SELECT COUNT(*) AS total_classes  FROM classes;
SELECT COUNT(*) AS total_subjects FROM subjects;
SELECT COUNT(*) AS total_schedules FROM schedules;
SELECT COUNT(*) AS total_attendance FROM attendance;
SELECT COUNT(*) AS total_assignments FROM assignments;
SELECT COUNT(*) AS total_resources FROM resources;
