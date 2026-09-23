const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runMasterTest() {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('🚀 DUC Classroom Management System - Full End-to-End System Test Suite');
  console.log('════════════════════════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ── 1. System Health & DB ──────────────────────────────────────────────
    console.log('🔹 [1/4] Checking Infrastructure & Health...');
    const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    assert(health.status === 200 && health.data.success === true, 'Health check endpoint returns 200');

    const dbStatus = await request({ hostname: 'localhost', port: 3000, path: '/api/db-status', method: 'GET' });
    assert(dbStatus.status === 200 && dbStatus.data.success === true, 'Database connection verified via /api/db-status');

    // ── 2. Admin Portal Verification (Phase 4) ────────────────────────────
    console.log('\n🔹 [2/4] Verifying Admin Portal & APIs (Phase 4)...');
    const adminLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin', password: 'Admin@123' });
    assert(adminLogin.status === 200 && adminLogin.data.data.user.role === 'admin', 'Admin login successful with role "admin"');

    const adminHeaders = {
      'Authorization': `Bearer ${adminLogin.data.data.token}`,
      'Content-Type': 'application/json'
    };

    const adminStats = await request({ hostname: 'localhost', port: 3000, path: '/api/admin/stats', method: 'GET', headers: adminHeaders });
    assert(adminStats.status === 200 && adminStats.data.data.totals && adminStats.data.data.totals.students >= 0, 'GET /api/admin/stats returns statistics');

    const classesRes = await request({ hostname: 'localhost', port: 3000, path: '/api/classes', method: 'GET', headers: adminHeaders });
    assert(classesRes.status === 200 && Array.isArray(classesRes.data.data), 'GET /api/classes lists classes');

    const subjectsRes = await request({ hostname: 'localhost', port: 3000, path: '/api/subjects', method: 'GET', headers: adminHeaders });
    assert(subjectsRes.status === 200 && Array.isArray(subjectsRes.data.data), 'GET /api/subjects lists subjects');

    const teachersRes = await request({ hostname: 'localhost', port: 3000, path: '/api/teachers', method: 'GET', headers: adminHeaders });
    assert(teachersRes.status === 200 && Array.isArray(teachersRes.data.data), 'GET /api/teachers lists teachers');

    const studentsRes = await request({ hostname: 'localhost', port: 3000, path: '/api/students', method: 'GET', headers: adminHeaders });
    assert(studentsRes.status === 200 && Array.isArray(studentsRes.data.data), 'GET /api/students lists students');

    const schedulesRes = await request({ hostname: 'localhost', port: 3000, path: '/api/schedules', method: 'GET', headers: adminHeaders });
    assert(schedulesRes.status === 200 && Array.isArray(schedulesRes.data.data), 'GET /api/schedules lists schedules');

    // ── 3. Teacher Portal Verification (Phase 5) ──────────────────────────
    console.log('\n🔹 [3/4] Verifying Teacher Portal & APIs (Phase 5)...');
    const teacherLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'teacher1', password: 'Teacher@123' });
    assert(teacherLogin.status === 200 && teacherLogin.data.data.user.role === 'teacher', 'Teacher login successful with role "teacher"');

    const teacherHeaders = {
      'Authorization': `Bearer ${teacherLogin.data.data.token}`,
      'Content-Type': 'application/json'
    };

    const teacherStats = await request({ hostname: 'localhost', port: 3000, path: '/api/teacher/stats', method: 'GET', headers: teacherHeaders });
    assert(teacherStats.status === 200 && teacherStats.data.data !== undefined, 'GET /api/teacher/stats returns teacher metrics');

    const teacherClasses = await request({ hostname: 'localhost', port: 3000, path: '/api/teacher/classes', method: 'GET', headers: teacherHeaders });
    assert(teacherClasses.status === 200 && Array.isArray(teacherClasses.data.data.classes), 'GET /api/teacher/classes returns assigned classes');

    const teacherAssignments = await request({ hostname: 'localhost', port: 3000, path: '/api/assignments', method: 'GET', headers: teacherHeaders });
    assert(teacherAssignments.status === 200 && Array.isArray(teacherAssignments.data.data), 'GET /api/assignments lists assignments');

    const teacherResources = await request({ hostname: 'localhost', port: 3000, path: '/api/resources', method: 'GET', headers: teacherHeaders });
    assert(teacherResources.status === 200 && Array.isArray(teacherResources.data.data), 'GET /api/resources lists teacher learning materials');

    // ── 4. Student Portal Verification (Phase 6) ──────────────────────────
    console.log('\n🔹 [4/4] Verifying Student Portal & APIs (Phase 6)...');
    const studentLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'student1', password: 'Student@123' });
    assert(studentLogin.status === 200 && studentLogin.data.data.user.role === 'student', 'Student login successful with role "student"');

    const studentHeaders = {
      'Authorization': `Bearer ${studentLogin.data.data.token}`,
      'Content-Type': 'application/json'
    };

    const studentDash = await request({ hostname: 'localhost', port: 3000, path: '/api/student/dashboard', method: 'GET', headers: studentHeaders });
    assert(studentDash.status === 200 && studentDash.data.data.student !== undefined, 'GET /api/student/dashboard returns dashboard data');

    const studentProfile = await request({ hostname: 'localhost', port: 3000, path: '/api/student/profile', method: 'GET', headers: studentHeaders });
    assert(studentProfile.status === 200 && studentProfile.data.data.student_id !== undefined, 'GET /api/student/profile returns student details');

    const studentSched = await request({ hostname: 'localhost', port: 3000, path: '/api/student/schedule', method: 'GET', headers: studentHeaders });
    assert(studentSched.status === 200 && Array.isArray(studentSched.data.data), 'GET /api/student/schedule returns student class timetable');

    const studentAtt = await request({ hostname: 'localhost', port: 3000, path: '/api/student/attendance', method: 'GET', headers: studentHeaders });
    assert(studentAtt.status === 200 && studentAtt.data.data.summary !== undefined, 'GET /api/student/attendance returns attendance summary');

    const studentAssign = await request({ hostname: 'localhost', port: 3000, path: '/api/student/assignments', method: 'GET', headers: studentHeaders });
    assert(studentAssign.status === 200 && Array.isArray(studentAssign.data.data), 'GET /api/student/assignments returns coursework list');

    const studentRes = await request({ hostname: 'localhost', port: 3000, path: '/api/student/resources', method: 'GET', headers: studentHeaders });
    assert(studentRes.status === 200 && Array.isArray(studentRes.data.data), 'GET /api/student/resources returns course study materials');

    // Security check: Student cannot alter data or access teacher/admin actions
    const studentIllegalPost = await request({
      hostname: 'localhost', port: 3000, path: '/api/assignments', method: 'POST',
      headers: studentHeaders
    }, { title: 'Hack' });
    assert(studentIllegalPost.status === 403, 'Security guard: Student blocked from creating assignments (403 Forbidden)');

    // ── 5. Static Pages Check ─────────────────────────────────────────────
    const allPages = [
      '/login.html',
      '/admin/dashboard.html',
      '/admin/students.html',
      '/admin/teachers.html',
      '/admin/classes.html',
      '/admin/subjects.html',
      '/admin/schedules.html',
      '/teacher/dashboard.html',
      '/teacher/attendance.html',
      '/teacher/schedule.html',
      '/teacher/assignments.html',
      '/teacher/resources.html',
      '/student/dashboard.html',
      '/student/profile.html',
      '/student/schedule.html',
      '/student/attendance.html',
      '/student/assignments.html',
      '/student/resources.html'
    ];

    let pagesOk = true;
    for (const p of allPages) {
      const pageRes = await request({ hostname: 'localhost', port: 3000, path: p, method: 'GET' });
      if (pageRes.status !== 200) {
        pagesOk = false;
        console.error(`  ❌ Failed page: ${p} returned ${pageRes.status}`);
      }
    }
    assert(pagesOk, `All 18 frontend HTML dashboard & portal views served with HTTP 200`);

  } catch (err) {
    console.error('System test exception:', err);
    failed++;
  }

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log(`System Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log('════════════════════════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

runMasterTest();
