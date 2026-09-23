// tests/run_all_tests.js
// ─────────────────────────────────────────────────────────────────────────────
// Master Test Runner for University Classroom Management System
// Runs all suites: Full System E2E, Student Portal, Security Audit, and Performance.
// ─────────────────────────────────────────────────────────────────────────────

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

function runScript(scriptPath) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: 'inherit' });
    child.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

function measureRequest(pathName, headers = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: pathName,
      method: 'GET',
      headers
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        resolve({ duration: Date.now() - start, status: res.statusCode });
      });
    });
    req.on('error', () => resolve({ duration: -1, status: 500 }));
    req.end();
  });
}

async function runPerformanceBenchmark() {
  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('⚡ Benchmark: Non-Functional Requirement NFR-01 (Response Time < 3s)');
  console.log('════════════════════════════════════════════════════════════════════════');

  // Authenticate admin to benchmark protected routes
  const loginRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve({}); }
      });
    });
    req.write(JSON.stringify({ username: 'admin', password: 'Admin@123' }));
    req.end();
  });

  const token = loginRes?.data?.token || '';
  const authHeaders = { 'Authorization': `Bearer ${token}` };

  const endpoints = [
    { name: 'Health Check', path: '/api/health', headers: {} },
    { name: 'Database Status', path: '/api/db-status', headers: {} },
    { name: 'Admin Statistics', path: '/api/admin/stats', headers: authHeaders },
    { name: 'Classes List', path: '/api/classes', headers: authHeaders },
    { name: 'Subjects List', path: '/api/subjects', headers: authHeaders },
    { name: 'Teachers List', path: '/api/teachers', headers: authHeaders },
    { name: 'Students List', path: '/api/students', headers: authHeaders },
    { name: 'Schedules List', path: '/api/schedules', headers: authHeaders }
  ];

  let allPass = true;
  let totalTime = 0;

  for (const ep of endpoints) {
    const { duration, status } = await measureRequest(ep.path, ep.headers);
    totalTime += duration;
    const ok = status === 200 && duration < 3000;
    if (!ok) allPass = false;

    console.log(`  ${ok ? '✅' : '❌'} ${ep.name.padEnd(20)}: ${duration}ms (HTTP ${status}) — Target: <3000ms`);
  }

  const avg = Math.round(totalTime / endpoints.length);
  console.log(`\n  📊 Average API Response Time: ${avg}ms (Requirement: < 3000ms)`);

  return allPass;
}

async function runMaster() {
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       DIGITAL UNIVERSITY OF CAMBODIA — SYSTEM QUALITY ASSURANCE       ║');
  console.log('║            University Classroom Management System (SAD)              ║');
  console.log('║            Class: G1-NW-B  ·  Student: ម៉ុក សម្បត្តិ                  ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

  const suites = [
    { name: 'Full System End-to-End Suite', file: path.join(__dirname, 'full_system_test.js') },
    { name: 'Student Portal Features Suite', file: path.join(__dirname, 'phase6_student_test.js') },
    { name: 'Security Audit & RBAC Suite', file: path.join(__dirname, 'security_audit_test.js') }
  ];

  const results = [];

  for (const suite of suites) {
    console.log(`\n▶ Running Suite: ${suite.name}...`);
    const pass = await runScript(suite.file);
    results.push({ name: suite.name, pass });
  }

  const perfPass = await runPerformanceBenchmark();
  results.push({ name: 'Performance & Latency Benchmark (NFR-01)', pass: perfPass });

  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('🏁 MASTER QUALITY ASSURANCE SUMMARY');
  console.log('════════════════════════════════════════════════════════════════════════');

  let failedCount = 0;
  for (const r of results) {
    if (r.pass) {
      console.log(`  ✅ PASSED : ${r.name}`);
    } else {
      console.log(`  ❌ FAILED : ${r.name}`);
      failedCount++;
    }
  }

  console.log('════════════════════════════════════════════════════════════════════════');
  if (failedCount === 0) {
    console.log('🎉 ALL QUALITY ASSURANCE SUITES PASSED (100% COMPLIANCE)!');
  } else {
    console.error(`⚠️  ${failedCount} suite(s) failed.`);
  }
  console.log('════════════════════════════════════════════════════════════════════════\n');

  process.exit(failedCount > 0 ? 1 : 0);
}

runMaster();
