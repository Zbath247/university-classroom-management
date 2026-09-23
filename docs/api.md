# API Documentation
# University Classroom Management System

## Base URL

```
http://localhost:3000/api
```

## Response Format

All API responses follow this consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Phase 1 Endpoints (Available Now)

### Health Check
```
GET /api/health
```
Returns server status. No authentication required.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "project": "University Classroom Management System",
  "university": "Digital University of Cambodia",
  "class": "G1-NW-B",
  "timestamp": "2026-09-21T01:00:00.000Z"
}
```

---

## Phase 3 Endpoints (Authentication — Coming Soon)

### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@duc.edu.kh",
      "role": "admin"
    }
  }
}
```

### Logout
```
POST /api/auth/logout
```
Requires: Authorization header

---

## Phase 4 Endpoints (Admin — Coming Soon)

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get student by ID |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

### Teachers
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/teachers | Get all teachers |
| GET | /api/teachers/:id | Get teacher by ID |
| POST | /api/teachers | Create teacher |
| PUT | /api/teachers/:id | Update teacher |
| DELETE | /api/teachers/:id | Delete teacher |

### Classes
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/classes | Get all classes |
| POST | /api/classes | Create class |
| PUT | /api/classes/:id | Update class |
| DELETE | /api/classes/:id | Delete class |

### Subjects
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/subjects | Get all subjects |
| POST | /api/subjects | Create subject |
| PUT | /api/subjects/:id | Update subject |
| DELETE | /api/subjects/:id | Delete subject |

### Schedules
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/schedules | Get all schedules |
| POST | /api/schedules | Create schedule |
| PUT | /api/schedules/:id | Update schedule |
| DELETE | /api/schedules/:id | Delete schedule |

---

## Phase 5 Endpoints (Teacher — Coming Soon)

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/attendance | Get attendance records |
| POST | /api/attendance | Record attendance |
| PUT | /api/attendance/:id | Update attendance |

### Assignments
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/assignments | Get assignments |
| POST | /api/assignments | Create assignment |
| PUT | /api/assignments/:id | Update assignment |
| DELETE | /api/assignments/:id | Delete assignment |

### Resources
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/resources | Get resources |
| POST | /api/resources | Create resource |
| PUT | /api/resources/:id | Update resource |
| DELETE | /api/resources/:id | Delete resource |
