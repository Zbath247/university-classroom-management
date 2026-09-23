// server/controllers/teacherStatsController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Provide statistics and metrics for the logged-in Teacher Dashboard.
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');

// Helper to get current teacher id
async function getTeacherId(req) {
  if (req.user.profileId) return req.user.profileId;
  const teachers = await query('SELECT id FROM teachers WHERE user_id = ?', [req.user.id]);
  if (teachers.length > 0) return teachers[0].id;
  if (req.user.role === 'admin' && req.query.teacher_id) return Number(req.query.teacher_id);
  // Default to first teacher for testing if admin
  const first = await query('SELECT id FROM teachers LIMIT 1');
  return first.length > 0 ? first[0].id : null;
}

// GET /api/teacher/stats
const getTeacherStats = async (req, res, next) => {
  try {
    const teacherId = await getTeacherId(req);
    if (!teacherId) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found.' });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // 1. Distinct classes taught by this teacher
    const classesTaught = await query(
      `SELECT DISTINCT c.id, c.class_code, c.class_name, c.academic_year
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       WHERE sch.teacher_id = ?`,
      [teacherId]
    );

    // 2. Today's classes
    const todaySchedules = await query(
      `SELECT sch.*, c.class_code, sub.subject_code, sub.subject_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       WHERE sch.teacher_id = ? AND sch.day_of_week = ?
       ORDER BY sch.start_time ASC`,
      [teacherId, todayName]
    );

    // 3. Total assignments created
    const assignmentsCount = await query(
      'SELECT COUNT(*) AS total FROM assignments WHERE teacher_id = ?',
      [teacherId]
    );

    // 4. Total resources shared
    const resourcesCount = await query(
      'SELECT COUNT(*) AS total FROM resources WHERE teacher_id = ?',
      [teacherId]
    );

    // 5. Recent assignments
    const recentAssignments = await query(
      `SELECT a.*, sub.subject_code, sub.subject_name, c.class_code
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       LEFT JOIN classes c ON a.class_id = c.id
       WHERE a.teacher_id = ?
       ORDER BY a.created_at DESC
       LIMIT 5`,
      [teacherId]
    );

    // 6. Teacher profile details
    const teacherRows = await query(
      'SELECT id AS profileId, teacher_id, full_name, gender, email, phone, department FROM teachers WHERE id = ?',
      [teacherId]
    );

    res.json({
      success: true,
      data: {
        teacher: teacherRows[0] || null,
        totals: {
          classes:     classesTaught.length,
          today:       todaySchedules.length,
          assignments: assignmentsCount[0]?.total || 0,
          resources:   resourcesCount[0]?.total || 0
        },
        classesTaught,
        todaySchedules,
        todayName,
        recentAssignments
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teacher/classes
const getTeacherClasses = async (req, res, next) => {
  try {
    const teacherId = await getTeacherId(req);
    if (!teacherId) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found.' });
    }

    const classes = await query(
      `SELECT DISTINCT c.id, c.class_code, c.class_name, c.academic_year
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       WHERE sch.teacher_id = ?
       ORDER BY c.class_code`,
      [teacherId]
    );

    // Also get subjects taught by this teacher
    const subjects = await query(
      `SELECT DISTINCT sub.id, sub.subject_code, sub.subject_name, sch.class_id
       FROM schedules sch
       JOIN subjects sub ON sch.subject_id = sub.id
       WHERE sch.teacher_id = ?
       ORDER BY sub.subject_code`,
      [teacherId]
    );

    res.json({
      success: true,
      data: {
        classes,
        subjects
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeacherStats,
  getTeacherClasses,
  getTeacherId
};
