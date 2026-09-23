# System Requirements
# University Classroom Management System

## Project Information
- **University:** Digital University of Cambodia
- **Class:** G1-NW-B
- **Student:** ម៉ុក សម្បត្តិ (Mok Sambath)
- **Subject:** System Analysis and Design (SAD)

---

## Functional Requirements

### Authentication
- FR-01: System shall allow users to log in with username and password
- FR-02: System shall support three roles: admin, teacher, student
- FR-03: System shall redirect users to role-appropriate dashboards
- FR-04: System shall protect all routes with authentication
- FR-05: Passwords shall be stored as bcrypt hashes

### Admin
- FR-10: Admin shall manage students (CRUD)
- FR-11: Admin shall manage teachers (CRUD)
- FR-12: Admin shall manage classes (CRUD)
- FR-13: Admin shall manage subjects (CRUD)
- FR-14: Admin shall manage schedules (CRUD)
- FR-15: Admin shall view attendance overview

### Teacher
- FR-20: Teacher shall view their assigned classes and schedule
- FR-21: Teacher shall record attendance per class per date
- FR-22: Teacher shall update attendance records
- FR-23: Teacher shall create and manage assignments
- FR-24: Teacher shall upload learning resources

### Student
- FR-30: Student shall view their class information
- FR-31: Student shall view their schedule
- FR-32: Student shall view their own attendance records
- FR-33: Student shall view assignments from their subjects
- FR-34: Student shall view learning resources from their subjects
- FR-35: Student shall NOT modify any administrative data

---

## Non-Functional Requirements
- NFR-01: System shall respond within 3 seconds for all operations
- NFR-02: System shall use parameterized queries (no SQL injection)
- NFR-03: System shall not expose database credentials in frontend
- NFR-04: System shall validate all user inputs on both frontend and backend
- NFR-05: System shall display meaningful error messages

---

## Technology Stack
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js v18+, Express.js v4 |
| Database | MySQL 8+ or MariaDB 10.6+ |
| Authentication | bcryptjs + JSON Web Tokens (JWT) |
