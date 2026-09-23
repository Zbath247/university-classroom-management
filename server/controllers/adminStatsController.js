// server/controllers/adminStatsController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Provide summary statistics and recent records for the Admin Dashboard.
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');

/**
 * GET /api/admin/stats
 * Returns total counts for students, teachers, classes, subjects,
 * plus recent student additions and today's schedule.
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [[studentsCount]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM students')
    ]);
    const [[teachersCount]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM teachers')
    ]);
    const [[classesCount]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM classes')
    ]);
    const [[subjectsCount]] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM subjects')
    ]);

    // Recent students (last 5)
    const recentStudents = await query(
      `SELECT s.id, s.student_id, s.full_name, s.full_name_kh, s.gender, s.created_at,
              c.class_code, c.class_name
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       ORDER BY s.created_at DESC
       LIMIT 5`
    );

    // Classes with student counts
    const classStats = await query(
      `SELECT c.id, c.class_code, c.class_name, c.academic_year,
              COUNT(s.id) AS student_count
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.id
       GROUP BY c.id
       ORDER BY c.class_code`
    );

    // Today's day name (e.g. 'Monday')
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    const todaySchedules = await query(
      `SELECT sch.id, sch.day_of_week, sch.start_time, sch.end_time, sch.room,
              c.class_code, sub.subject_code, sub.subject_name,
              t.full_name AS teacher_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.day_of_week = ?
       ORDER BY sch.start_time`,
      [todayName]
    );

    res.json({
      success: true,
      data: {
        totals: {
          students: studentsCount.total || 0,
          teachers: teachersCount.total || 0,
          classes:  classesCount.total || 0,
          subjects: subjectsCount.total || 0
        },
        recentStudents,
        classStats,
        todaySchedules,
        todayName
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats };
