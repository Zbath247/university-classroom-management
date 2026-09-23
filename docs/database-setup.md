# Database Setup Guide
# University Classroom Management System — Phase 2

## Overview

This guide explains how to set up the MySQL database for this project.

---

## Prerequisites

You must have **MySQL** or **MariaDB** installed and running.

### Check if MySQL is running:
```bash
# In PowerShell or Command Prompt:
mysql --version
```

You should see something like: `mysql  Ver 8.0.35`

---

## Step 1 — Open MySQL

Open **MySQL Command Line Client** or **HeidiSQL** or **MySQL Workbench**.

If using command line:
```bash
mysql -u root -p
```
Then enter your MySQL root password.

---

## Step 2 — Import the Schema (Create Tables)

```bash
mysql -u root -p < database/schema.sql
```

**OR** open `database/schema.sql` in HeidiSQL/Workbench and click **Execute**.

This creates:
- The `classroom_db` database
- All 9 tables with proper relationships

---

## Step 3 — Import Sample Data

```bash
mysql -u root -p classroom_db < database/seed.sql
```

This adds:
- 1 admin account
- 2 teacher accounts
- 6 student accounts
- 3 classes (including G1-NW-B)
- 5 subjects
- 10 schedule entries
- 24 attendance records
- 5 assignments
- 6 resources

---

## Step 4 — Update Your .env File

Open `.env` and set your MySQL password:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password_here
DB_NAME=classroom_db
```

> If your MySQL has **no password** (empty), leave `DB_PASSWORD=` blank.

---

## Step 5 — Test the Connection

Start the server:
```bash
npm run dev
```

Then visit: **http://localhost:3000/api/db-status**

### ✅ Success response:
```json
{
  "success": true,
  "message": "Database connected successfully",
  "database": "classroom_db",
  "tables": [...]
}
```

### ❌ Failure response:
```json
{
  "success": false,
  "message": "Database not connected: ...",
  "hint": "Make sure MySQL is running and you have imported schema.sql and seed.sql"
}
```

---

## Default Login Accounts

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | admin     | Admin@123   |
| Teacher | teacher1  | Teacher@123 |
| Teacher | teacher2  | Teacher@123 |
| Student | student1  | Student@123 |
| Student | student2  | Student@123 |
| Student | student3  | Student@123 |

> **Note:** Authentication (login) will be implemented in Phase 3.

---

## Database Tables

| Table       | Description                        | Rows (sample) |
|-------------|-----------------------------------|---------------|
| users       | Login accounts for all roles       | 9             |
| classes     | Class groups (G1-NW-B, etc.)       | 3             |
| subjects    | Academic subjects                  | 5             |
| teachers    | Teacher profiles                   | 2             |
| students    | Student profiles                   | 6             |
| schedules   | Weekly class timetable             | 10            |
| attendance  | Daily attendance records           | 24            |
| assignments | Assignments created by teachers    | 5             |
| resources   | Learning materials by teachers     | 6             |
