# ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀនសាកលវិទ្យាល័យ
# University Classroom Management System

## Project Information

| Field | Detail |
|---|---|
| **University** | Digital University of Cambodia |
| **Class** | G1-NW-B |
| **Student** | ម៉ុក សម្បត្តិ (Mok Sambath) |
| **Major** | Information Technology – Networking |
| **Subject** | System Analysis and Design (SAD) |

---

## Description

A complete web-based University Classroom Management System supporting three roles:

- **Administrator** — Manage students, teachers, classes, subjects, and schedules
- **Teacher** — Record attendance, create assignments, share learning resources
- **Student** — View schedule, attendance, assignments, and resources

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL / MariaDB |
| Auth | JWT (JSON Web Token) + bcrypt |

---

## Prerequisites

Before running this project, make sure you have installed:

1. **Node.js** (v18 or later) — https://nodejs.org
2. **MySQL** or **MariaDB** — https://www.mysql.com
3. **Git** — https://git-scm.com

---

## Installation & Setup

### Step 1 — Clone or download the project
```bash
git clone <your-repo-url>
cd System_Project2_SAD
```

### Step 2 — Install Node.js dependencies
```bash
npm install
```
> This installs all packages listed in `package.json`. It creates a `node_modules/` folder.

### Step 3 — Create your environment file
```bash
copy .env.example .env
```
Then open `.env` and fill in your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=classroom_db
```

### Step 4 — Set up the database (Phase 2)
```bash
# Import the database schema
mysql -u root -p < database/schema.sql

# Import sample data
mysql -u root -p < database/seed.sql
```
> ⚠️ This step is completed in Phase 2.

### Step 5 — Start the server
```bash
# Development mode (auto-restarts on changes)
npm run dev

# Production mode
npm start
```

### Step 6 — Open the application
```
http://localhost:3000
```

---

## Project Structure

```
System_Project2_SAD/
│
├── client/                  # Frontend (HTML, CSS, JavaScript)
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── admin/               # Admin pages
│   ├── teacher/             # Teacher pages
│   ├── student/             # Student pages
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   └── assets/              # Images, icons
│
├── server/                  # Backend (Node.js / Express.js)
│   ├── config/              # Database config
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth, error handling
│   ├── models/              # Database queries
│   ├── routes/              # API routes
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── database/                # SQL files
│   ├── schema.sql           # Table definitions
│   └── seed.sql             # Sample data
│
├── docs/                    # Documentation
│   ├── api.md               # API reference
│   └── requirements.md      # System requirements
│
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── package.json             # Node.js project config
└── README.md                # This file
```

---

## Default Login Accounts (After Phase 2)

| Role | Username | Password |
|---|---|---|
| Admin | admin | Admin@123 |
| Teacher | teacher1 | Teacher@123 |
| Student | student1 | Student@123 |

---

## API Health Check

After starting the server, visit:
```
http://localhost:3000/api/health
```
You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## Development Phases

- [x] Phase 1 — Project Setup
- [x] Phase 2 — Database Design
- [x] Phase 3 — Authentication
- [x] Phase 4 — Admin Features
- [x] Phase 5 — Teacher Features
- [x] Phase 6 — Student Features
- [x] Phase 7 — UI/UX Polish
- [x] Phase 8 — Security Review
- [x] Phase 9 — Testing
- [x] Phase 10 — Final Demo

---

## Documentation & Defense Guides

- 📖 **[System Requirements](docs/requirements.md)** — Functional & Non-functional specifications
- 🗄️ **[Database Setup Guide](docs/database-setup.md)** — Schema structure and relational tables
- 🔌 **[API Documentation](docs/api.md)** — Complete REST API reference
- 🧪 **[Testing & QA Report](docs/testing.md)** — 72 automated test assertions matrix & results
- 🎓 **[Final Demo & Defense Guide](docs/demo-guide.md)** — Step-by-step presentation script & Q&A cheatsheet

