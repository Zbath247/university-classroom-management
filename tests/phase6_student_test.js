const http = require('http');

const BASE_URL = 'http://localhost:3000';

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

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 Running Phase 6 (Student Features) Automated Test Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

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
    // 1. Health check
    const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    assert(health.status === 200 && health.data.success === true, 'Server health check returns 200');

    // 2. Student Authentication
    const loginRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'student1', password: 'Student@123' });

    assert(loginRes.status === 200 && loginRes.data.success === true, 'Student login succeeds with 200');
    assert(loginRes.data.data && loginRes.data.data.token, 'Student login returns valid JWT token');
    assert(loginRes.data.data && loginRes.data.data.user.role === 'student', 'User role is "student"');

    const studentToken = loginRes.data.data.token;
    const authHeaders = {
      'Authorization': `Bearer ${studentToken}`,
      'Content-Type': 'application/json'
    };

    // 3. GET /api/student/dashboard
    const dashRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/dashboard',
      method: 'GET',
      headers: authHeaders
    });
    assert(dashRes.status === 200 && dashRes.data.success === true, 'GET /api/student/dashboard returns 200');
    assert(dashRes.data.data && dashRes.data.data.student !== undefined, 'Dashboard contains student profile info');
    assert(dashRes.data.data && dashRes.data.data.stats !== undefined, 'Dashboard contains academic stats summary');

    // 4. GET /api/student/profile
    const profRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/profile',
      method: 'GET',
      headers: authHeaders
    });
    assert(profRes.status === 200 && profRes.data.success === true, 'GET /api/student/profile returns 200');
    assert(profRes.data.data && (profRes.data.data.student_id || profRes.data.data.student_id_code), 'Profile contains student_id');

    // 5. PUT /api/student/profile (update phone)
    const updateRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/profile',
      method: 'PUT',
      headers: authHeaders
    }, { phone: '012999888' });
    assert(updateRes.status === 200 && updateRes.data.success === true, 'PUT /api/student/profile updates student phone number');

    // 6. GET /api/student/schedule
    const schedRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/schedule',
      method: 'GET',
      headers: authHeaders
    });
    assert(schedRes.status === 200 && schedRes.data.success === true, 'GET /api/student/schedule returns 200');
    assert(Array.isArray(schedRes.data.data), 'Student schedule returns an array of timetable items');

    // 7. GET /api/student/attendance
    const attRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/attendance',
      method: 'GET',
      headers: authHeaders
    });
    assert(attRes.status === 200 && attRes.data.success === true, 'GET /api/student/attendance returns 200');
    assert(attRes.data.data && attRes.data.data.summary && typeof attRes.data.data.summary.attendanceRate === 'number', 'Student attendance includes rate percentage');

    // 8. GET /api/student/assignments
    const assignRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/assignments',
      method: 'GET',
      headers: authHeaders
    });
    assert(assignRes.status === 200 && assignRes.data.success === true, 'GET /api/student/assignments returns 200');
    assert(Array.isArray(assignRes.data.data), 'Assignments returns an array of course assignments');

    // 9. GET /api/student/resources
    const resRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/resources',
      method: 'GET',
      headers: authHeaders
    });
    assert(resRes.status === 200 && resRes.data.success === true, 'GET /api/student/resources returns 200');
    assert(Array.isArray(resRes.data.data), 'Resources returns an array of study materials');

    // 10. Role Protection check: Student cannot create assignment (POST /api/assignments)
    const unauthorizedAction = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/assignments',
      method: 'POST',
      headers: authHeaders
    }, { title: 'Illegal Student Assignment', subject_id: 1 });
    assert(unauthorizedAction.status === 403, 'Role guard: Student cannot create assignments (Returns 403 Forbidden)');

    // 11. Role Protection check: Student cannot access Admin stats (GET /api/admin/stats)
    const unauthorizedAdmin = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/stats',
      method: 'GET',
      headers: authHeaders
    });
    assert(unauthorizedAdmin.status === 403, 'Role guard: Student cannot access Admin stats (Returns 403 Forbidden)');

    // 12. Frontend Pages Availability (Status 200)
    const pages = [
      '/student/dashboard.html',
      '/student/profile.html',
      '/student/schedule.html',
      '/student/attendance.html',
      '/student/assignments.html',
      '/student/resources.html'
    ];

    for (const page of pages) {
      const pageRes = await request({ hostname: 'localhost', port: 3000, path: page, method: 'GET' });
      assert(pageRes.status === 200, `Frontend static page ${page} serves HTTP 200`);
    }

  } catch (err) {
    console.error('Unexpected test failure:', err);
    failed++;
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('═══════════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
