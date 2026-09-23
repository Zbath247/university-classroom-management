// server/controllers/studentPortalController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Dedicated controller for the Student Portal.
// Enforces read-only academic data access for the authenticated student.
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');
const path   = require('path');
const fs     = require('fs');
const { query } = require('../config/db');

// Helper to get student record
async function getStudentProfile(req) {
  const students = await query(
    `SELECT s.*, COALESCE(s.avatar, u.avatar) AS avatar, c.class_code, c.class_name, c.academic_year, u.username, u.email AS user_email
     FROM students s
     LEFT JOIN classes c ON s.class_id = c.id
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.user_id = ?`,
    [req.user.id]
  );

  if (students.length > 0) return students[0];

  // Fallback for admin previewing as student
  if (req.user.role === 'admin' || req.user.role === 'teacher') {
    const studentId = req.query.student_id || 1;
    const fallback = await query(
      `SELECT s.*, COALESCE(s.avatar, u.avatar) AS avatar, c.class_code, c.class_name, c.academic_year, u.username, u.email AS user_email
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [studentId]
    );
    return fallback[0] || null;
  }

  return null;
}

// GET /api/student/dashboard
const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // 1. Enrolled subjects count (from schedules for their class)
    const subjects = await query(
      `SELECT DISTINCT sub.id, sub.subject_code, sub.subject_name, sub.credits
       FROM schedules sch
       JOIN subjects sub ON sch.subject_id = sub.id
       WHERE sch.class_id = ?`,
      [student.class_id || 0]
    );

    // 2. Personal attendance summary
    const attRecords = await query(
      'SELECT status, COUNT(*) AS count FROM attendance WHERE student_id = ? GROUP BY status',
      [student.id]
    );
    const summary = { present: 0, late: 0, absent: 0, permission: 0, total: 0 };
    attRecords.forEach(r => {
      if (summary[r.status] !== undefined) {
        summary[r.status] = Number(r.count);
        summary.total += Number(r.count);
      }
    });
    const attendanceRate = summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 100;

    // 3. Pending assignments count (assignments for their class with due_date >= today)
    const todayStr = new Date().toISOString().substring(0, 10);
    const assignments = await query(
      `SELECT a.*, sub.subject_code, sub.subject_name
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       WHERE (a.class_id = ? OR a.class_id IS NULL)
       ORDER BY a.due_date ASC`,
      [student.class_id || 0]
    );

    // 4. Today's schedule for student's class
    const todaySchedule = await query(
      `SELECT sch.*, sub.subject_code, sub.subject_name, t.full_name AS teacher_name
       FROM schedules sch
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.class_id = ? AND sch.day_of_week = ?
       ORDER BY sch.start_time ASC`,
      [student.class_id || 0, todayName]
    );

    res.json({
      success: true,
      data: {
        student: {
          id:           student.id,
          student_id:   student.student_id,
          full_name:    student.full_name,
          full_name_kh: student.full_name_kh,
          class_code:   student.class_code || 'Unassigned',
          class_name:   student.class_name || '',
          academic_year:student.academic_year || ''
        },
        totals: {
          classCode:      student.class_code || 'N/A',
          subjectsCount:  subjects.length,
          attendanceRate: attendanceRate,
          assignmentsCount: assignments.length
        },
        stats: {
          classCode:      student.class_code || 'N/A',
          subjectsCount:  subjects.length,
          attendanceRate: attendanceRate,
          assignmentsCount: assignments.length
        },
        todaySchedule,
        todayName,
        upcomingAssignments: assignments.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/profile
const getProfile = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/profile (Only update phone or password)
const updateProfile = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const { phone, current_password, new_password, avatar } = req.body;

    if (phone !== undefined) {
      await query('UPDATE students SET phone = ? WHERE id = ?', [phone.trim(), student.id]);
    }

    if (avatar !== undefined) {
      await query('UPDATE students SET avatar = ? WHERE id = ?', [avatar, student.id]);
      if (student.user_id) {
        await query('UPDATE users SET avatar = ? WHERE id = ?', [avatar, student.user_id]);
      }
    }

    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ success: false, message: 'Current password is required to change password.' });
      }

      const users = await query('SELECT password FROM users WHERE id = ?', [student.user_id]);
      const match = await bcrypt.compare(current_password, users[0].password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }

      const hashed = await bcrypt.hash(new_password, 10);
      await query('UPDATE users SET password = ? WHERE id = ?', [hashed, student.user_id]);
    }

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/student/profile/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Clean up old avatar if exists in /uploads/avatars/
    const oldAvatar = student.avatar;
    if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../../', oldAvatar);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Could not delete old avatar:', err.message);
        }
      });
    }

    // Update students and users records
    await query('UPDATE students SET avatar = ? WHERE id = ?', [avatarUrl, student.id]);
    if (student.user_id) {
      await query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, student.user_id]);
    }

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully.',
      data: {
        avatar: avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/profile/avatar
const deleteAvatar = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const oldAvatar = student.avatar;
    if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../../', oldAvatar);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Could not delete avatar file:', err.message);
        }
      });
    }

    await query('UPDATE students SET avatar = NULL WHERE id = ?', [student.id]);
    if (student.user_id) {
      await query('UPDATE users SET avatar = NULL WHERE id = ?', [student.user_id]);
    }

    res.json({
      success: true,
      message: 'Profile photo removed successfully.',
      data: {
        avatar: null
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/schedule
const getStudentSchedule = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student || !student.class_id) {
      return res.json({ success: true, data: [] });
    }

    const schedule = await query(
      `SELECT sch.*, sub.subject_code, sub.subject_name, sub.credits,
              t.full_name AS teacher_name, t.department
       FROM schedules sch
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.class_id = ?
       ORDER BY FIELD(sch.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
                sch.start_time ASC`,
      [student.class_id]
    );

    res.json({ success: true, count: schedule.length, data: schedule });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/attendance
const getStudentAttendance = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const records = await query(
      `SELECT att.*, sub.subject_code, sub.subject_name, t.full_name AS teacher_name
       FROM attendance att
       JOIN subjects sub ON att.subject_id = sub.id
       JOIN teachers t ON att.teacher_id = t.id
       WHERE att.student_id = ?
       ORDER BY att.attendance_date DESC`,
      [student.id]
    );

    const summary = { present: 0, late: 0, absent: 0, permission: 0, total: records.length };
    records.forEach(r => {
      if (summary[r.status] !== undefined) summary[r.status]++;
    });

    const rate = summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 100;

    res.json({
      success: true,
      data: {
        summary: { ...summary, attendanceRate: rate },
        records
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/assignments
const getStudentAssignments = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const assignments = await query(
      `SELECT a.*, sub.subject_code, sub.subject_name, t.full_name AS teacher_name
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       JOIN teachers t ON a.teacher_id = t.id
       WHERE (a.class_id = ? OR a.class_id IS NULL)
       ORDER BY a.due_date ASC, a.created_at DESC`,
      [student.class_id || 0]
    );

    res.json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/resources
const getStudentResources = async (req, res, next) => {
  try {
    const student = await getStudentProfile(req);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Resources for subjects taught in student's class
    const resources = await query(
      `SELECT DISTINCT r.*, sub.subject_code, sub.subject_name, t.full_name AS teacher_name
       FROM resources r
       JOIN subjects sub ON r.subject_id = sub.id
       JOIN teachers t ON r.teacher_id = t.id
       WHERE r.subject_id IN (
         SELECT DISTINCT subject_id FROM schedules WHERE class_id = ?
       )
       ORDER BY r.created_at DESC`,
      [student.class_id || 0]
    );

    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getStudentSchedule,
  getStudentAttendance,
  getStudentAssignments,
  getStudentResources
};
