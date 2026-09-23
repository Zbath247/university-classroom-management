-- ═══════════════════════════════════════════════════════════════════════════
-- database/schema.sql
-- University Classroom Management System — Database Schema
-- Digital University of Cambodia · G1-NW-B · ម៉ុក សម្បត្តិ
--
-- HOW TO RUN:
--   mysql -u root -p < database/schema.sql
--
-- OR open MySQL Workbench / HeidiSQL and paste + execute this file.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Create & select the database ────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS classroom_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE classroom_db;

-- ── Drop tables in reverse order (to avoid foreign key conflicts) ────────────
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 1: users
-- Stores login credentials for all system users.
-- Each user has ONE role: admin, teacher, or student.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE users (
  id         INT            UNSIGNED NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)    NOT NULL,
  email      VARCHAR(100)   NOT NULL,
  password   VARCHAR(255)   NOT NULL,   -- bcrypt hash, NEVER plain text
  role       ENUM('admin','teacher','student') NOT NULL DEFAULT 'student',
  avatar     VARCHAR(255)   DEFAULT NULL,
  is_active  TINYINT(1)     NOT NULL DEFAULT 1,
  created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email    (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System login accounts';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 2: classes
-- Represents a class group (e.g., G1-NW-B).
-- Created BEFORE students because students belong to a class.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE classes (
  id            INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  class_code    VARCHAR(20)  NOT NULL,           -- e.g. G1-NW-B
  class_name    VARCHAR(100) NOT NULL,           -- e.g. Group 1 Networking B
  academic_year VARCHAR(20)  NOT NULL,           -- e.g. 2025-2026
  description   TEXT,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_classes_code (class_code),
  INDEX idx_classes_year (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Class groups';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 3: subjects
-- Represents a course/subject taught in the university.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE subjects (
  id            INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_code  VARCHAR(20)  NOT NULL,           -- e.g. SAD-101
  subject_name  VARCHAR(150) NOT NULL,           -- e.g. System Analysis and Design
  description   TEXT,
  credits       TINYINT      UNSIGNED DEFAULT 3,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_subjects_code (subject_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Academic subjects/courses';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 4: teachers
-- Extended profile for users with role = 'teacher'.
-- FOREIGN KEY: user_id → users(id)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE teachers (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT          UNSIGNED NOT NULL,    -- linked to users table
  teacher_id  VARCHAR(20)  NOT NULL,             -- staff ID e.g. TCH-001
  full_name   VARCHAR(100) NOT NULL,
  gender      ENUM('male','female','other') DEFAULT 'male',
  email       VARCHAR(100) NOT NULL,
  phone       VARCHAR(20),
  department  VARCHAR(100),
  avatar      VARCHAR(255) DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_teachers_user_id   (user_id),
  UNIQUE KEY uq_teachers_tid       (teacher_id),
  UNIQUE KEY uq_teachers_email     (email),
  INDEX idx_teachers_name (full_name),

  CONSTRAINT fk_teachers_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Teacher profiles';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 5: students
-- Extended profile for users with role = 'student'.
-- FOREIGN KEYS: user_id → users(id), class_id → classes(id)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE students (
  id            INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT          UNSIGNED NOT NULL,    -- linked to users table
  student_id    VARCHAR(20)  NOT NULL,             -- e.g. STU-2024-001
  full_name     VARCHAR(100) NOT NULL,
  full_name_kh  VARCHAR(100),                      -- Khmer name
  gender        ENUM('male','female','other') DEFAULT 'male',
  date_of_birth DATE,
  phone         VARCHAR(20),
  email         VARCHAR(100),
  avatar        VARCHAR(255) DEFAULT NULL,
  class_id      INT          UNSIGNED,             -- which class they belong to
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_students_user_id  (user_id),
  UNIQUE KEY uq_students_sid      (student_id),
  INDEX idx_students_class (class_id),
  INDEX idx_students_name  (full_name),

  CONSTRAINT fk_students_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_students_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Student profiles';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 6: schedules
-- Links a class + subject + teacher to a specific day/time/room.
-- This is the timetable.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE schedules (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  class_id    INT          UNSIGNED NOT NULL,
  subject_id  INT          UNSIGNED NOT NULL,
  teacher_id  INT          UNSIGNED NOT NULL,     -- references teachers.id
  day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  start_time  TIME         NOT NULL,              -- e.g. 07:30:00
  end_time    TIME         NOT NULL,              -- e.g. 09:30:00
  room        VARCHAR(50),                        -- e.g. Room 201
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_schedules_class   (class_id),
  INDEX idx_schedules_teacher (teacher_id),
  INDEX idx_schedules_day     (day_of_week),

  CONSTRAINT fk_schedules_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_schedules_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_schedules_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Class timetable/schedules';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 7: attendance
-- Records the attendance status of a student for a specific subject on a date.
-- Status: present | absent | late | permission
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE attendance (
  id              INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id      INT          UNSIGNED NOT NULL,  -- references students.id
  subject_id      INT          UNSIGNED NOT NULL,
  teacher_id      INT          UNSIGNED NOT NULL,  -- who recorded it
  attendance_date DATE         NOT NULL,
  status          ENUM('present','absent','late','permission') NOT NULL DEFAULT 'present',
  remark          VARCHAR(255),                    -- optional note
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- Prevent duplicate attendance for same student+subject+date
  UNIQUE KEY uq_attendance (student_id, subject_id, attendance_date),
  INDEX idx_attendance_date    (attendance_date),
  INDEX idx_attendance_student (student_id),
  INDEX idx_attendance_subject (subject_id),

  CONSTRAINT fk_attendance_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_attendance_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_attendance_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Student attendance records';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 8: assignments
-- Created by teachers, belongs to a subject.
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE assignments (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_id  INT          UNSIGNED NOT NULL,
  teacher_id  INT          UNSIGNED NOT NULL,
  class_id    INT          UNSIGNED,               -- optional: specific class
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  due_date    DATE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_assignments_subject (subject_id),
  INDEX idx_assignments_teacher (teacher_id),
  INDEX idx_assignments_due     (due_date),

  CONSTRAINT fk_assignments_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_assignments_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_assignments_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Assignments created by teachers';

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 9: resources
-- Learning materials shared by teachers (links to files, videos, docs).
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE resources (
  id           INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_id   INT          UNSIGNED NOT NULL,
  teacher_id   INT          UNSIGNED NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  file_url     VARCHAR(500),                       -- URL or file path
  resource_type ENUM('document','video','link','other') DEFAULT 'document',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_resources_subject (subject_id),
  INDEX idx_resources_teacher (teacher_id),

  CONSTRAINT fk_resources_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_resources_teacher
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Learning resources shared by teachers';

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE: schema.sql complete
-- Tables created: users, classes, subjects, teachers, students,
--                 schedules, attendance, assignments, resources
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 'Database schema created successfully!' AS Status;
