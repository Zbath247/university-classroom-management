# មគ្គុទ្ទេសក៍បង្ហាញ Demo និងការពារគម្រោង (Final Demo & Defense Guide)
# University Classroom Management System
# ប្រព័ន្ធគ្រប់គ្រងថ្នាក់រៀនសាកលវិទ្យាល័យ

---

## 1. ព័ត៌មានគម្រោង (Project Information)

| ព័ត៌មាន | ខ្លឹមសារ |
|---|---|
| **សាកលវិទ្យាល័យ** | Digital University of Cambodia (DUC) |
| **ថ្នាក់ / ជំនាន់** | G1-NW-B (ឆ្នាំទី ១ ជំនាន់ទី ១) |
| **និស្សិតធ្វើបទបង្ហាញ** | **ម៉ុក សម្បត្តិ** (Mok Sambath) |
| **ជំនាញ** | Information Technology – Networking |
| **មុខវិជ្ជា** | System Analysis and Design (SAD) |
| **សាស្ត្រាចារ្យណែនាំ** | សាស្ត្រាចារ្យដេប៉ាតឺម៉ង់វិទ្យាសាស្ត្រកុំព្យូទ័រ DUC |
| **កាលបរិច្ឆេទ** | ខែកញ្ញា ឆ្នាំ ២០២៦ |

---

## 2. គណនីសម្រាប់ធ្វើ Demo (Demo Credentials)

ប្រព័ន្ធមានប៊ូតុង **Quick Auto-fill** នៅលើទំព័រ Login (`http://localhost:3000/login.html`) ស្រាប់៖

| តួនាទី (Role) | ឈ្មោះគណនី (Username) | ពាក្យសម្ងាត់ (Password) | ទំព័រ Dashboard | ពណ៌សម្គាល់ (Theme) |
|---|---|---|---|---|
| **Administrator** | `admin` | `Admin@123` | `/admin/dashboard.html` | 🔵 Royal Navy Blue (`#1e40af`) |
| **Teacher** | `teacher1` | `Teacher@123` | `/teacher/dashboard.html` | 🟢 Emerald Forest (`#047857`) |
| **Student** | `student1` | `Student@123` | `/student/dashboard.html` | 🔴 Crimson Ruby (`#7f1d1d`) |

---

## 3. កាលវិភាគនិងជំហានធ្វើ Demo (Step-by-Step Live Demo Script)

### ⏱️ ដំណាក់កាលទី ១ — ការណែនាំ និងស្ថាបត្យកម្មប្រព័ន្ធ (~២ នាទី)
- **សកម្មភាព:** បើកទំព័រ `http://localhost:3000/login.html`
- **ចំណុចនិយាយ (Talking Points):**
  - សូមគោរពលោកគ្រូ និងសហការីទាំងអស់។ ខ្ញុំបាទឈ្មោះ **ម៉ុក សម្បត្តិ** មកពីថ្នាក់ **G1-NW-B**។
  - ថ្ងៃនេះខ្ញុំបាទសូមបង្ហាញនូវប្រព័ន្ធ **University Classroom Management System** ដែលបានរចនាឡើងតាមស្តង់ដារ System Analysis and Design (SAD)។
  - ប្រព័ន្ធប្រើប្រាស់ **Node.js/Express.js** លើ Backend, **MySQL Database** និង **Vanilla HTML5/CSS3/JavaScript** ដោយគ្មាន Dependency ធ្ងន់ធ្ងរនៅលើ Frontend ធ្វើឱ្យប្រព័ន្ធមានល្បឿនលឿនបំផុត (Average Latency: ~4ms)។

---

### ⏱️ ដំណាក់កាលទី ២ — Administrator Portal Demo (~៣ នាទី)
- **សកម្មភាព:** ចុចលើប៊ូតុង `👑 Admin` រួចចុច **Sign In**
- **លំហូរការបង្ហាញ (Workflow):**
  1. **Dashboard:** បង្ហាញ Card សរុបចំនួនសិស្ស (Students), គ្រូ (Teachers), ថ្នាក់ (Classes), មុខវិជ្ជា (Subjects), និងកាលវិភាគថ្ងៃនេះ។
  2. **Students Management (`/admin/students.html`):**
     - បង្ហាញតារាងសិស្ស មាន Search bar ស្វែងរកតាមឈ្មោះ ឬលេខកូដសិស្ស (`DUC-2026-xxx`)
     - បង្ហាញ Modal បន្ថែមសិស្សថ្មី (Add Student)
     - សាកល្បងចុចប៊ូតុង **Delete** លើសិស្ស ដើម្បីបង្ហាញ **Custom Confirm Dialog** ថ្មី (មិនមែនប្រអប់ alert បុរាណ)។
  3. **Schedules Management (`/admin/schedules.html`):**
     - បង្ហាញកាលវិភាគបង្រៀនប្រចាំសប្តាហ៍ បែងចែកតាមបន្ទប់ ថ្នាក់ គ្រូ និងម៉ោងសិក្សា។

---

### ⏱️ ដំណាក់កាលទី ៣ — Teacher Portal Demo (~៣ នាទី)
- **សកម្មភាព:** ចុច Logout ហើយចូលគណនី `👨‍🏫 Teacher` (`teacher1` / `Teacher@123`)
- **លំហូរការបង្ហាញ (Workflow):**
  1. **Teacher Dashboard:** បង្ហាញស្ថិតិម៉ោងបង្រៀនថ្ងៃនេះ កិច្ចការដែលបានដាក់ និងឯកសារដែលបាន Upload។
  2. **Attendance Sheet (`/teacher/attendance.html`):**
     - ជ្រើសរើសថ្នាក់ `G1-NW-B`, មុខវិជ្ជា `SAD-101`, និងកាលបរិច្ឆេទថ្ងៃនេះ។
     - ចុច **Load Roster** ដើម្បីទាញឈ្មោះនិស្សិតទាំងអស់ក្នុងថ្នាក់មកបង្ហាញ។
     - ចុចប៊ូតុង **"Mark All Present"** — គ្រប់និស្សិតទាំងអស់ត្រូវបានជ្រើសរើសជា Present ភ្លាមៗ។
     - កែប្រែសិស្សម្នាក់ជា `Late` ឬ `Permission` រួចចុច **"Save Attendance Records"**។
     - បង្ហាញ Toast Notification ជោគជ័យពណ៌បៃតង។
  3. **Assignments & Resources:**
     - បង្ហាញការបង្កើតកិច្ចការផ្ទះ (Assignment) និងការចែករំលែកស្លាយបង្រៀន (Resource) តាម Subject។

---

### ⏱️ ដំណាក់កាលទី ៤ — Student Portal Demo (~២ នាទី)
- **សកម្មភាព:** ចូលគណនី `🎓 Student` (`student1` / `Student@123`)
- **លំហូរការបង្ហាញ (Workflow):**
  1. **Student Dashboard:** បង្ហាញបន្ទុកមុខវិជ្ជា អត្រាវត្តមាន (Attendance Rate %) ម៉ោងរៀនថ្ងៃនេះ និងកិច្ចការត្រូវប្រគល់។
  2. **My Profile (`/student/profile.html`):**
     - បង្ហាញ Digital Student Identity Card មានឡូហ្គោ DUC លេខកូដសម្គាល់ និងឈ្មោះជាភាសាខ្មែរ-អង់គ្លេស។
     - សាកល្បងកែប្រែលេខទូរស័ព្ទផ្ទាល់ខ្លួន។
  3. **Timetable & Attendance:** មើលកាលវិភាគថ្នាក់ខ្លួន និងប្រវត្តិវត្តមានលម្អិត។
  4. **Resources Repository:** មើលនិងបើកតំណភ្ជាប់ឯកសារមេរៀន និងវីដេអូបង្រៀនរបស់គ្រូ។
  5. **Security Verification (FR-35):** បង្ហាញថានិស្សិតមានសិទ្ធិត្រឹមតែ Read-Only លើកំណត់ត្រាសិក្សា មិនអាចកែប្រែទិន្នន័យអ្នកដទៃបានឡើយ។

---

### ⏱️ ដំណាក់កាលទី ៥ — Security & Performance QA Live Demo (~២ នាទី)
- **សកម្មភាព:** បើក Terminal រួចវាយ៖
  ```bash
  npm test
  ```
- **លទ្ធផលរំពឹងទុក:**
  - បង្ហាញការរត់តេស្តដោយស្វ័យប្រវត្តិចំនួន **៧២ តេស្ត (72/72 Assertions)**
  - បញ្ជាក់ការការពារ SQL Injection, Anti-XSS, Rate Limiting, RBAC Security Guards
  - បង្ហាញកម្រិត Performance Response Time ជាមធ្យមត្រឹម **4ms** (< 3000ms តាមលក្ខខណ្ឌ NFR-01)
  - បញ្ចប់ដោយសញ្ញាជោគជ័យ ១០០% (100% Compliance)。

---

## 4. សំណួរ-ចម្លើយគន្លឹះសម្រាប់ការពារគម្រោង (Q&A Defense Cheatsheet)

### សំណួរទី ១៖ តើប្អូនអនុវត្ត Role-Based Access Control (RBAC) យ៉ាងដូចម្តេច?
> **ចម្លើយ:** ខ្ញុំបាទបានបង្កើត Middleware ចំនួនពីរគឺ `protect` និង `restrictTo('admin', 'teacher', 'student')` នៅក្នុង [server/middleware/auth.js](file:///c:/Users/Mok%20Sambath/Documents/System_Project2_SAD/server/middleware/auth.js)។ នៅពេល Client ធ្វើ Request មក ប្រព័ន្ធនឹងឆែក JSON Web Token (JWT)។ ប្រសិនបើតួនាទីក្នុង Token មិនត្រូវគ្នានឹង Endpoint នោះទេ ប្រព័ន្ធនឹងឆ្លើយតប `HTTP 403 Forbidden` ភ្លាមៗ។

### សំណួរទី ២៖ តើប្រព័ន្ធការពារ SQL Injection យ៉ាងដូចម្តេច?
> **ចម្លើយ:** គ្រប់ Controller ទាំងអស់ (១០០%) ប្រើប្រាស់ Parameterized Queries (Prepared Statements ជាមួយសញ្ញា `?`) តាមរយៈបណ្ណាល័យ `mysql2` នៅក្នុង [server/config/db.js](file:///c:/Users/Mok%20Sambath/Documents/System_Project2_SAD/server/config/db.js)។ ទិន្នន័យបញ្ចូលពីអ្នកប្រើប្រាស់មិនដែលត្រូវបានភ្ជាប់ជា string (`concat`) ចូលទៅក្នុង SQL Statement ឡើយ ដូច្នេះ Payload វាយប្រហារនឹងត្រូវរាប់ជា String ធម្មតា។

### សំណួរទី ៣៖ តើប្រព័ន្ធការពារការវាយប្រហារ Brute-Force Password យ៉ាងដូចម្តេច?
> **ចម្លើយ:** ខ្ញុំបាទបានសរសេរ `RateLimiter` នៅក្នុង [server/middleware/security.js](file:///c:/Users/Mok%20Sambath/Documents/System_Project2_SAD/server/middleware/security.js) ដោយកំណត់ឱ្យ IP នីមួយៗអាចព្យាយាម Login បានត្រឹមតែ ៣០ ដងក្នុង ៥ នាទី។ ប្រសិនបើលើសកម្រិតនេះ ប្រព័ន្ធនឹងទាត់ចេញដោយស្វ័យប្រវត្តិជាមួយ `HTTP 429 Too Many Requests`។

### សំណួរទី ៤៖ តើការកត់ត្រាវត្តមានសិស្សដំណើរការយ៉ាងដូចម្តេច?
> **ចម្លើយ:** សម្រាប់គ្រូបង្រៀន ប្រព័ន្ធមាន Batch Attendance API (`POST /api/attendance/batch`) ដែលអនុញ្ញាតឱ្យគ្រូអាចបញ្ជូនវត្តមានសិស្សទាំងមូលក្នុងថ្នាក់ត្រឹមតែមួយ Click ប៉ុណ្ណោះ ដោយប្រើ MySQL Transaction (`START TRANSACTION`, `COMMIT`) ធានាថាទិន្នន័យទាំងអស់ត្រូវកត់ត្រាចូលដោយសុវត្ថិភាព និងល្បឿនលឿនបំផុត។

---

**ជោគជ័យ ១០០% សម្រាប់ការធ្វើបទបង្ហាញ និងការពារគម្រោង SAD! 🎓✨**
