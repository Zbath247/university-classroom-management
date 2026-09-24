-- =============================================================================
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
(4, 'CA',    'Cloud Architecture',        'Cloud Architecture & Infrastructure (CA) — លោកគ្រូ គឿន មេសា', 3);

-- 3. USERS
INSERT INTO users (id, username, email, password, role) VALUES
-- Admin (admin / admin@123)
(1, 'admin', 'admin@duc.edu.kh', '$2a$10$JQAyEPeBu8r1t/2T.9G3TOb7yPZs6a6d7L9FlnwgtvcJ6ccX4mxaO', 'admin'),

-- Teachers (teacher@123)
(2, 'vuthey', 'vuthey@duc.edu.kh', '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO', 'teacher'),
(3, 'vavy',   'vavy@duc.edu.kh',   '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO', 'teacher'),
(4, 'mesa',   'mesa@duc.edu.kh',   '$2a$10$dkVRl7NltjI5q.rLRndxi.GGW8wXcUhCdPVm6sfEa78ObbLW68mcO', 'teacher'),

-- Student Rep: Mok Sambath (sambath / student@123)
(5, 'sambath', 'sambath@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(6, 'keov_puthearoth', 'duc2024-0017@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(7, 'khong_sophim', 'duc2024-0026@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(8, 'kim_sokdin', 'duc2024-0058@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(9, 'khorn_promden', 'duc2024-0066@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(10, 'khun_pisey', 'duc2024-0074@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(11, 'khun_ratanak', 'duc2024-0075@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(12, 'chory_sreymao', 'duc2024-0088@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(13, 'chhoeut_mao', 'duc2024-0112@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(14, 'chhem_lina', 'duc2024-0118@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(15, 'chim_vannet', 'duc2024-0128@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(16, 'dy_chanthou', 'duc2024-0178@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(17, 'nann_khie', 'duc2024-0194@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(18, 'nom_laiheang', 'duc2024-0189@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(19, 'thorn_reaksmey', 'duc2024-0222@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(20, 'net_vanny', 'duc2024-0275@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(21, 'noeun_sreyneang', 'duc2024-0293@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(22, 'pey_thavry', 'duc2024-0319@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(23, 'pon_seyha', 'duc2024-0324@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(24, 'phat_phally', 'duc2024-0346@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(25, 'phai_pov', 'duc2024-0363@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(26, 'peom_lenghong', 'duc2024-0372@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(27, 'mounh_sophanit', 'duc2024-0431@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(28, 'mao_reaksmey', 'duc2024-0436@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(29, 'yun_bunkeo', 'duc2024-0444@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(30, 'yoeurn_vannak', 'duc2024-0466@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(31, 'yeng_puthida', 'duc2024-0470@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(32, 'yen_sinet', 'duc2024-0472@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(33, 'romas_reu', 'duc2024-0489@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(34, 'reach_pov', 'duc2024-0494@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(35, 'ruon_vanny', 'duc2024-0515@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(36, 'roeurn_seanhong', 'duc2024-0522@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(37, 'roeurn_sreyneth', 'duc2024-0523@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(38, 'roeurn_sreynich', 'duc2024-0524@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(39, 'romdosh_pumea', 'duc2024-0483@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(40, 'leang_seyha', 'duc2024-0536@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(41, 'lek_khamran', 'duc2024-0540@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(42, 'ly_pylan', 'duc2024-0544@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(43, 'leab_bopha', 'duc2024-0562@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(44, 'vong_sodavuthy', 'duc2024-0566@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(45, 'vay_bin', 'duc2024-0585@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(46, 'sorng_visal', 'duc2024-0615@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(47, 'sambath_sokmean', 'duc2024-0623@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(48, 'soy_koemsodany', 'duc2024-0624@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(49, 'sol_somaol', 'duc2024-0633@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(50, 'san_davitnol', 'duc2024-0646@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(51, 'san_lizea', 'duc2024-0648@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(52, 'san_him', 'duc2024-0651@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(53, 'saroeurng_pheakdey', 'duc2024-0658@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(54, 'seun_sovanndara', 'duc2024-0677@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(55, 'suong_vireak', 'duc2024-0699@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(56, 'sea_narak', 'duc2024-0715@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(57, 'seng_sopheadavid', 'duc2024-0725@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(58, 'sem_sokliza', 'duc2024-0741@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(59, 'svay_phearun', 'duc2024-0757@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(60, 'horng_sineat', 'duc2024-0760@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(61, 'hoen_chanthai', 'duc2024-0779@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(62, 'loem_sophorn', 'duc2024-0818@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(63, 'lot_chornny', 'duc2024-0825@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(64, 'art_oeun', 'duc2024-0842@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(65, 'ol_samphors', 'duc2024-0856@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student'),
(66, 'el_vanney', 'duc2024-0879@duc.edu.kh', '$2a$10$q9qhvcwokO3.ZGQaIw9/xeR6zNWm9O867Kg0DGPTIm5Vs9m1Jviby', 'student');

-- 4. TEACHERS
INSERT INTO teachers (id, user_id, teacher_id, full_name, gender, email, department) VALUES
(1, 2, 'TCH-001', 'Mr. Chheang Vuthey (ឈាង វុទ្ធី)', 'male', 'vuthey@duc.edu.kh', 'Computer Network & Security'),
(2, 3, 'TCH-002', 'Mr. Sem Vavy (សែម វ៉ាវី)',         'male', 'vavy@duc.edu.kh',   'Computer Network & Security'),
(3, 4, 'TCH-003', 'Mr. Koeun Mesa (គឿន មេសា)',        'male', 'mesa@duc.edu.kh',   'Cloud & Infrastructure');

-- 5. STUDENTS (Total 62 students)
INSERT INTO students (id, user_id, student_id, full_name, full_name_kh, gender, phone, email, class_id) VALUES
(1, 5, 'DUC2024-0001', 'Mok Sambath', 'ម៉ុក សម្បត្តិ', 'male', 't.me/moksambath', 'sambath@duc.edu.kh', 1),
(2, 6, 'DUC2024-0017', 'Keov Puthearoth', 'កែវ ពុទ្ធារ័ត្ន', 'female', 't.me/RoatBella', 'duc2024-0017@duc.edu.kh', 1),
(3, 7, 'DUC2024-0026', 'Khong Sophim', 'ខង សុភីម', 'female', 't.me/Khong_sophim', 'duc2024-0026@duc.edu.kh', 1),
(4, 8, 'DUC2024-0058', 'Kim Sokdin', 'គឹម សុខឌីន', 'female', 't.me/sokdinn', 'duc2024-0058@duc.edu.kh', 1),
(5, 9, 'DUC2024-0066', 'Khorn Promden', 'ឃន ព្រំដែន', 'male', 't.me/Khorn_Promden', 'duc2024-0066@duc.edu.kh', 1),
(6, 10, 'DUC2024-0074', 'Khun Pisey', 'ឃុន ពិសី', 'male', 't.me/khun_pisey168', 'duc2024-0074@duc.edu.kh', 1),
(7, 11, 'DUC2024-0075', 'Khun Ratanak', 'ឃុន រត្នណ្ណៈ', 'female', 't.me/Khun_ratanak7', 'duc2024-0075@duc.edu.kh', 1),
(8, 12, 'DUC2024-0088', 'Chory Sreymao', 'ចយ ស្រីម៉ៅ', 'female', 't.me/sreymaochory', 'duc2024-0088@duc.edu.kh', 1),
(9, 13, 'DUC2024-0112', 'Chhoeut Mao', 'ឆើត ម៉ៅ', 'male', 't.me/Chhoeut_Mao', 'duc2024-0112@duc.edu.kh', 1),
(10, 14, 'DUC2024-0118', 'Chhem Lina', 'ឆែម លីណា', 'female', 't.me/chhem_lina', 'duc2024-0118@duc.edu.kh', 1),
(11, 15, 'DUC2024-0128', 'Chim Vannet', 'ជឹម វ៉ាន់ណែត', 'male', 't.me/vannet454107', 'duc2024-0128@duc.edu.kh', 1),
(12, 16, 'DUC2024-0178', 'Dy Chanthou', 'ឌី ចាន់ធូ', 'female', 't.me/dy_chanthou', 'duc2024-0178@duc.edu.kh', 1),
(13, 17, 'DUC2024-0194', 'Nann Khie', 'ណាន់ ឃៀ', 'female', 't.me/Laaaazzz12', 'duc2024-0194@duc.edu.kh', 1),
(14, 18, 'DUC2024-0189', 'Nom Laiheang', 'ណំ ឡៃហៀង', 'male', 't.me/vireak_nem01', 'duc2024-0189@duc.edu.kh', 1),
(15, 19, 'DUC2024-0222', 'Thorn Reaksmey', 'ថន រស្មី', 'male', 't.me/rsmey4ever', 'duc2024-0222@duc.edu.kh', 1),
(16, 20, 'DUC2024-0275', 'Net Vanny', 'និត វណ្ណនី', 'male', 't.me/Vanny_Dmn', 'duc2024-0275@duc.edu.kh', 1),
(17, 21, 'DUC2024-0293', 'Noeun Sreyneang', 'នឿន ស្រីនាង', 'female', 't.me/Sreyneang39', 'duc2024-0293@duc.edu.kh', 1),
(18, 22, 'DUC2024-0319', 'Pey Thavry', 'ប៉ី ថាវរី', 'female', 't.me/Peythavry', 'duc2024-0319@duc.edu.kh', 1),
(19, 23, 'DUC2024-0324', 'Pon Seyha', 'ប៉ុន សីហា', 'male', 't.me/Pon_Seyha6', 'duc2024-0324@duc.edu.kh', 1),
(20, 24, 'DUC2024-0346', 'Phat Phally', 'ផាត ផល្លី', 'male', 't.me/Phally_07', 'duc2024-0346@duc.edu.kh', 1),
(21, 25, 'DUC2024-0363', 'Phai Pov', 'ផៃ ពៅ', 'male', 't.me/BozzPovv', 'duc2024-0363@duc.edu.kh', 1),
(22, 26, 'DUC2024-0372', 'Peom Lenghong', 'ពឹម ឡេងហុង', 'male', 't.me/Lenghong3', 'duc2024-0372@duc.edu.kh', 1),
(23, 27, 'DUC2024-0431', 'Mounh Sophanit', 'ម៉ោញ សុផានីត', 'male', 't.me/MOUNH_sophanit', 'duc2024-0431@duc.edu.kh', 1),
(24, 28, 'DUC2024-0436', 'Mao Reaksmey', 'ម៉ៅ រស្មី', 'female', 't.me/Mao_Reaksmey', 'duc2024-0436@duc.edu.kh', 1),
(25, 29, 'DUC2024-0444', 'Yun Bunkeo', 'យន់ ប៊ុនកែវ', 'male', 't.me/Keo_ft_Nich', 'duc2024-0444@duc.edu.kh', 1),
(26, 30, 'DUC2024-0466', 'Yoeurn Vannak', 'យឿន វណ្ណៈ', 'male', 't.me/MrrNakShop', 'duc2024-0466@duc.edu.kh', 1),
(27, 31, 'DUC2024-0470', 'Yeng Puthida', 'យ៉េង ពុទ្ធិដា', 'female', 't.me/dalove326', 'duc2024-0470@duc.edu.kh', 1),
(28, 32, 'DUC2024-0472', 'Yen Sinet', 'យ៉េន ស៊ីណែត', 'male', 't.me/Dont_forget_Neth', 'duc2024-0472@duc.edu.kh', 1),
(29, 33, 'DUC2024-0489', 'Romas Reu', 'រម៉ាស់ រើ', 'female', 't.me/RomasReu234', 'duc2024-0489@duc.edu.kh', 1),
(30, 34, 'DUC2024-0494', 'Reach Pov', 'រាជ ពៅ', 'male', 't.me/Reach_pov', 'duc2024-0494@duc.edu.kh', 1),
(31, 35, 'DUC2024-0515', 'Ruon Vanny', 'រួន វណ្ណី', 'male', 't.me/Roun_vanny', 'duc2024-0515@duc.edu.kh', 1),
(32, 36, 'DUC2024-0522', 'Roeurn Seanhong', 'រឿន សៀនហុង', 'male', 't.me/seanhong12', 'duc2024-0522@duc.edu.kh', 1),
(33, 37, 'DUC2024-0523', 'Roeurn Sreyneth', 'រឿន ស្រីណែត', 'female', 't.me/Daun_sreyneth', 'duc2024-0523@duc.edu.kh', 1),
(34, 38, 'DUC2024-0524', 'Roeurn Sreynich', 'រឿន ស្រីនិច្ច', 'female', 't.me/ROEURNSreynich11', 'duc2024-0524@duc.edu.kh', 1),
(35, 39, 'DUC2024-0483', 'Romdosh Pumea', 'រំដោះ ពូមៀ', 'male', 't.me/MeaDUC007', 'duc2024-0483@duc.edu.kh', 1),
(36, 40, 'DUC2024-0536', 'Leang Seyha', 'លាង សីហា', 'male', 't.me/leangseyha168', 'duc2024-0536@duc.edu.kh', 1),
(37, 41, 'DUC2024-0540', 'Lek Khamran', 'លិក ខាំរ៉ាន', 'male', 't.me/Khamram', 'duc2024-0540@duc.edu.kh', 1),
(38, 42, 'DUC2024-0544', 'Ly Pylan', 'លី ភីឡាន់', 'male', 't.me/Lanpyhe', 'duc2024-0544@duc.edu.kh', 1),
(39, 43, 'DUC2024-0562', 'Leab Bopha', 'លៀប បុប្ផា', 'female', 't.me/BOPHA5', 'duc2024-0562@duc.edu.kh', 1),
(40, 44, 'DUC2024-0566', 'Vong Sodavuthy', 'វង្ស សូដាវុឌ្ឍី', 'male', 't.me/SODAVOTHY', 'duc2024-0566@duc.edu.kh', 1),
(41, 45, 'DUC2024-0585', 'Vay Bin', 'វ៉ាយ ប៉ីន', 'female', 't.me/VAYBin', 'duc2024-0585@duc.edu.kh', 1),
(42, 46, 'DUC2024-0615', 'Sorng Visal', 'ស៊ង វិសាល', 'male', 't.me/VisalCNC748', 'duc2024-0615@duc.edu.kh', 1),
(43, 47, 'DUC2024-0623', 'Sambath Sokmean', 'សម្បត្តិ សុខមាន', 'female', 't.me/Mean6364', 'duc2024-0623@duc.edu.kh', 1),
(44, 48, 'DUC2024-0624', 'Soy Koemsodany', 'សយ គឹមសុដានី', 'female', 't.me/Soykeomsodany', 'duc2024-0624@duc.edu.kh', 1),
(45, 49, 'DUC2024-0633', 'Sol Somaol', 'សល់ សំអុល', 'male', 't.me/solsomaol', 'duc2024-0633@duc.edu.kh', 1),
(46, 50, 'DUC2024-0646', 'San Davitnol', 'សាន ដាវីតណុល', 'male', 't.me/SANDAVITNOL', 'duc2024-0646@duc.edu.kh', 1),
(47, 51, 'DUC2024-0648', 'San Lizea', 'សាន់ លីសៀ', 'female', '', 'duc2024-0648@duc.edu.kh', 1),
(48, 52, 'DUC2024-0651', 'San Him', 'សាន ហ៊ីម', 'male', 't.me/SanHimkht', 'duc2024-0651@duc.edu.kh', 1),
(49, 53, 'DUC2024-0658', 'Saroeurng Pheakdey', 'សារឿង ភក្តី', 'male', 't.me/pheakdey13', 'duc2024-0658@duc.edu.kh', 1),
(50, 54, 'DUC2024-0677', 'Seun Sovanndara', 'ស៊ឺន សុវណ្ណដារ៉ា', 'male', 't.me/SANDAVITNOL', 'duc2024-0677@duc.edu.kh', 1),
(51, 55, 'DUC2024-0699', 'Suong Vireak', 'សួង វីរ:', 'male', 't.me/SUONG_Vireak', 'duc2024-0699@duc.edu.kh', 1),
(52, 56, 'DUC2024-0715', 'Sea Narak', 'សៀ ណារ៉ាក់', 'male', 't.me/SEA_NARAK', 'duc2024-0715@duc.edu.kh', 1),
(53, 57, 'DUC2024-0725', 'Seng Sopheadavid', 'សេង សុភាដាវិឌ', 'male', 't.me/DavidGK01', 'duc2024-0725@duc.edu.kh', 1),
(54, 58, 'DUC2024-0741', 'Sem Sokliza', 'សែម សុខលីហ្សា', 'female', '', 'duc2024-0741@duc.edu.kh', 1),
(55, 59, 'DUC2024-0757', 'Svay Phearun', 'ស្វាយ ភារុន', 'male', 't.me/phearunrun', 'duc2024-0757@duc.edu.kh', 1),
(56, 60, 'DUC2024-0760', 'Horng Sineat', 'ហង់ ស៊ីនាត', 'male', 't.me/Neat19', 'duc2024-0760@duc.edu.kh', 1),
(57, 61, 'DUC2024-0779', 'Hoen Chanthai', 'ហឹន ចាន់ថៃ', 'female', 't.me/CHANTHAI6435', 'duc2024-0779@duc.edu.kh', 1),
(58, 62, 'DUC2024-0818', 'Loem Sophorn', 'ឡឹម សុភ័ណ្ឌ', 'female', 't.me/LOEMsophorn', 'duc2024-0818@duc.edu.kh', 1),
(59, 63, 'DUC2024-0825', 'Lot Chornny', 'ឡូត ចននី', 'male', 't.me/Lot_chornny', 'duc2024-0825@duc.edu.kh', 1),
(60, 64, 'DUC2024-0842', 'Art Oeun', 'អ៊ាត អឿន', 'male', 't.me/ARTOEUN1', 'duc2024-0842@duc.edu.kh', 1),
(61, 65, 'DUC2024-0856', 'Ol Samphors', 'អុល សម្ផស្ស', 'female', 't.me/El_Vanney', 'duc2024-0856@duc.edu.kh', 1),
(62, 66, 'DUC2024-0879', 'El Vanney', 'អ៊ែល វណ្ណី', 'male', 't.me/sreyphorssmos', 'duc2024-0879@duc.edu.kh', 1);

-- 6. SCHEDULES (Class G1-NW-B official timetable in Room DUC3)
INSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
(1, 1, 1, 'Friday',   '08:00:00', '11:00:00', 'DUC3'),  -- SAD by Chheang Vuthey
(1, 2, 2, 'Friday',   '13:00:00', '15:00:00', 'DUC3'),  -- ITPM by Sem Vavy
(1, 3, 2, 'Friday',   '15:00:00', '16:30:00', 'DUC3'),  -- CSC.V by Sem Vavy
(1, 4, 3, 'Saturday', '08:00:00', '11:00:00', 'DUC3');  -- CA by Koeun Mesa

SELECT 'Import Completed Successfully!' AS Status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_students FROM students;
