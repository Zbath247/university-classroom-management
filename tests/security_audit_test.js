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

async function runSecurityAudit() {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('🔒 DUC Classroom Management System - Phase 8 Security Audit Test Suite');
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
    // ── 1. HTTP Security Headers ───────────────────────────────────────────
    console.log('🔹 [1/6] Auditing HTTP Headers & Server Fingerprinting...');
    const health = await request({ hostname: 'localhost', port: 3000, path: '/api/health', method: 'GET' });
    
    assert(!health.headers['x-powered-by'], 'Server finger-printing: X-Powered-By header is disabled');
    assert(health.headers['x-content-type-options'] === 'nosniff', 'MIME sniffing protection: X-Content-Type-Options: nosniff present');
    assert(health.headers['x-frame-options'] === 'SAMEORIGIN', 'Clickjacking defense: X-Frame-Options: SAMEORIGIN present');
    assert(health.headers['x-xss-protection'] && health.headers['x-xss-protection'].includes('1'), 'Cross-Site Scripting filter: X-XSS-Protection present');

    // ── 2. SQL Injection Resistance ───────────────────────────────────────
    console.log('\n🔹 [2/6] Auditing SQL Injection Resistance...');
    // Attempt SQL injection in login
    const sqlInjLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: "' OR '1'='1' --", password: "' OR '1'='1'" });
    assert(sqlInjLogin.status === 401, 'SQL Injection in Auth: Malicious payload rejected with 401');

    // Authenticate clean student
    const studentLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'student1', password: 'Student@123' });
    const studentToken = studentLogin.data.data.token;
    const studentHeaders = { 'Authorization': `Bearer ${studentToken}` };

    // Authenticate clean admin
    const adminLogin = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin', password: 'Admin@123' });
    const adminToken = adminLogin.data.data.token;
    const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

    // Attempt SQL injection in query params
    const sqlInjSearch = await request({
      hostname: 'localhost', port: 3000, path: "/api/students?search=%27%20UNION%20SELECT%201,2,3,4,5,6,7,8,9,10--",
      method: 'GET', headers: adminHeaders
    });
    assert(sqlInjSearch.status === 200, 'SQL Injection in Search query: Parameterized query sanitized search input safely');

    // ── 3. Sensitive Data Exposure & Password Privacy ──────────────────────
    console.log('\n🔹 [3/6] Auditing Sensitive Data Exposure & Password Privacy...');
    assert(!studentLogin.data.data.user.password && !studentLogin.data.data.user.password_hash, 'Auth Response: User password hash is never exposed in login response');

    const meRes = await request({ hostname: 'localhost', port: 3000, path: '/api/auth/me', method: 'GET', headers: studentHeaders });
    assert(!meRes.data.data.password && !meRes.data.data.password_hash, '/api/auth/me: User password hash is never exposed');

    // ── 4. Role-Based Access Control (RBAC) Enforcement ────────────────────
    console.log('\n🔹 [4/6] Auditing Role-Based Access Control (RBAC)...');
    // Student attempting Admin endpoint
    const studentToAdmin = await request({ hostname: 'localhost', port: 3000, path: '/api/admin/stats', method: 'GET', headers: studentHeaders });
    assert(studentToAdmin.status === 403, 'RBAC: Student forbidden from Admin stats (403)');

    // Student attempting Teacher attendance endpoint
    const studentToAttendance = await request({
      hostname: 'localhost', port: 3000, path: '/api/attendance/batch', method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' }
    }, { class_id: 1, subject_id: 1, attendance_date: '2026-09-21', records: [] });
    assert(studentToAttendance.status === 403, 'RBAC: Student forbidden from recording attendance (403)');

    // Unauthenticated access to protected endpoint
    const unauthenticated = await request({ hostname: 'localhost', port: 3000, path: '/api/students', method: 'GET' });
    assert(unauthenticated.status === 401, 'RBAC: Unauthenticated access rejected with 401');

    // ── 5. Token Security & Tamper Resistance ──────────────────────────────
    console.log('\n🔹 [5/6] Auditing JWT Signature & Tamper Resistance...');
    const tamperedToken = studentToken.substring(0, studentToken.length - 6) + 'abcdef';
    const tamperedRes = await request({
      hostname: 'localhost', port: 3000, path: '/api/student/dashboard', method: 'GET',
      headers: { 'Authorization': `Bearer ${tamperedToken}` }
    });
    assert(tamperedRes.status === 401, 'JWT Verification: Tampered token signature rejected with 401');

    const garbageRes = await request({
      hostname: 'localhost', port: 3000, path: '/api/student/dashboard', method: 'GET',
      headers: { 'Authorization': 'Bearer invalid.token.value' }
    });
    assert(garbageRes.status === 401, 'JWT Verification: Malformed token rejected with 401');

    // ── 6. Input Sanitization (Anti-XSS) ──────────────────────────────────
    console.log('\n🔹 [6/6] Auditing Input Sanitization & Anti-XSS Protection...');
    const xssPayload = {
      phone: '012111222<script>alert("XSS")</script>'
    };
    const updateRes = await request({
      hostname: 'localhost', port: 3000, path: '/api/student/profile', method: 'PUT',
      headers: { 'Authorization': `Bearer ${studentToken}`, 'Content-Type': 'application/json' }
    }, xssPayload);
    assert(updateRes.status === 200, 'Input Sanitization: Profile update with script tag processed safely');

    const profileVerify = await request({ hostname: 'localhost', port: 3000, path: '/api/student/profile', method: 'GET', headers: studentHeaders });
    assert(!profileVerify.data.data.phone.includes('<script>'), 'Anti-XSS: Malicious <script> tags stripped from stored input');

  } catch (err) {
    console.error('Security audit test failure:', err);
    failed++;
  }

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log(`Security Audit Summary: ${passed} Passed, ${failed} Failed`);
  console.log('════════════════════════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

runSecurityAudit();
