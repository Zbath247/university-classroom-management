# Testing & Quality Assurance (QA) Report
# University Classroom Management System
# ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀនសាកលវិទ្យាល័យ

---

## 1. Project Information

| Field | Detail |
|---|---|
| **University** | Digital University of Cambodia (DUC) |
| **Class** | G1-NW-B |
| **Student Name** | ម៉ុក សម្បត្តិ (Mok Sambath) |
| **Subject** | System Analysis and Design (SAD) |
| **Version** | 1.0.0 (Production Candidate) |
| **Date** | 2026-09-21 |

---

## 2. Test Execution Overview

All automated test suites are executed concurrently through the master test runner:
```bash
npm test
```
This runs four comprehensive verification suites:
1. **Full System End-to-End Suite** (`tests/full_system_test.js`)
2. **Student Portal Features Suite** (`tests/phase6_student_test.js`)
3. **Security Audit & RBAC Suite** (`tests/security_audit_test.js`)
4. **Performance & Latency Benchmark** (NFR-01)

### Execution Summary

| Test Suite | Total Tests | Passed | Failed | Compliance Rate |
|---|:---:|:---:|:---:|:---:|
| **Full System E2E Suite** | 23 | 23 | 0 | 100% |
| **Student Portal Suite** | 26 | 26 | 0 | 100% |
| **Security Audit Suite** | 15 | 15 | 0 | 100% |
| **Performance Benchmark** | 8 | 8 | 0 | 100% |
| **Total Quality Assertions** | **72** | **72** | **0** | **100%** |

---

## 3. Functional Requirements Traceability Matrix

### 3.1 Authentication Requirements (FR-01 to FR-05)
| Req ID | Requirement Description | Test Case | Status |
|---|---|---|:---:|
| **FR-01** | User login with username & password | Verified with Admin, Teacher, and Student credentials | **PASS** |
| **FR-02** | Support 3 roles: admin, teacher, student | Verified distinct role attributes in JWT & UI | **PASS** |
| **FR-03** | Redirect users to role dashboards | `/admin/dashboard.html`, `/teacher/dashboard.html`, `/student/dashboard.html` | **PASS** |
| **FR-04** | Protect routes with authentication | Unauthenticated requests receive HTTP 401 | **PASS** |
| **FR-05** | Passwords stored as bcrypt hashes | Password hashes never exposed; salted bcrypt comparison | **PASS** |

### 3.2 Administrator Requirements (FR-10 to FR-15)
| Req ID | Requirement Description | Test Case | Status |
|---|---|---|:---:|
| **FR-10** | Manage students (CRUD) | `GET /api/students`, `POST`, `PUT`, `DELETE` verified | **PASS** |
| **FR-11** | Manage teachers (CRUD) | `GET /api/teachers`, `POST`, `PUT`, `DELETE` verified | **PASS** |
| **FR-12** | Manage classes (CRUD) | `GET /api/classes`, `POST`, `PUT`, `DELETE` verified | **PASS** |
| **FR-13** | Manage subjects (CRUD) | `GET /api/subjects`, `POST`, `PUT`, `DELETE` verified | **PASS** |
| **FR-14** | Manage schedules (CRUD) | `GET /api/schedules`, `POST`, `PUT`, `DELETE` verified | **PASS** |
| **FR-15** | View attendance overview | `GET /api/attendance` & `GET /api/attendance/summary` verified | **PASS** |

### 3.3 Teacher Requirements (FR-20 to FR-24)
| Req ID | Requirement Description | Test Case | Status |
|---|---|---|:---:|
| **FR-20** | View assigned classes & schedules | `GET /api/teacher/classes` and timetable verified | **PASS** |
| **FR-21** | Record attendance per class per date | `POST /api/attendance/batch` with roster grid | **PASS** |
| **FR-22** | Update attendance records | Radio toggle (Present, Late, Absent, Permission) | **PASS** |
| **FR-23** | Manage course assignments | `GET /api/assignments`, `POST`, `PUT`, `DELETE` | **PASS** |
| **FR-24** | Upload & share learning resources | `GET /api/resources`, `POST`, `PUT`, `DELETE` | **PASS** |

### 3.4 Student Requirements (FR-30 to FR-35)
| Req ID | Requirement Description | Test Case | Status |
|---|---|---|:---:|
| **FR-30** | View class & profile information | `GET /api/student/profile` with Student ID card | **PASS** |
| **FR-31** | View weekly class schedule | `GET /api/student/schedule` filtered for G1-NW-B | **PASS** |
| **FR-32** | View personal attendance records | `GET /api/student/attendance` with percentage badge | **PASS** |
| **FR-33** | View assignments from enrolled subjects | `GET /api/student/assignments` with status tags | **PASS** |
| **FR-34** | View and open learning resources | `GET /api/student/resources` with direct links | **PASS** |
| **FR-35** | Read-only access enforcement | Student blocked from `/api/assignments` POST (403) | **PASS** |

---

## 4. Non-Functional Requirements Verification Matrix

| Req ID | Requirement Description | Target Specification | Measured Result | Status |
|---|---|---|---|:---:|
| **NFR-01** | System response time | Latency < 3000ms | **Average: 4ms** (Peak: 13ms) | **PASS** |
| **NFR-02** | SQL Injection defense | Parameterized queries | 100% Prepared Statements (`?`) | **PASS** |
| **NFR-03** | Secure credentials | No secrets in frontend | `.env` variables isolated on server | **PASS** |
| **NFR-04** | Input validation & Sanitization | Both client and server | Anti-XSS filters & schema validation | **PASS** |
| **NFR-05** | Meaningful error messages | Safe error codes | MySQL error mapping without schema leaks | **PASS** |

---

## 5. Test Accounts Reference

| Role | Username | Password | Default Dashboard |
|---|---|---|---|
| **Administrator** | `admin` | `Admin@123` | `/admin/dashboard.html` |
| **Teacher** | `teacher1` | `Teacher@123` | `/teacher/dashboard.html` |
| **Student** | `student1` | `Student@123` | `/student/dashboard.html` |

---

## 6. How to Run Tests Locally

Make sure the server is running on `http://localhost:3000`:
```bash
# Terminal 1 — Start Server
npm start

# Terminal 2 — Run All Test Suites
npm test
```
