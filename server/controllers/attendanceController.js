// server/controllers/attendanceController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage student attendance records (Daily Roster, Batch Save, Updates).
// ─────────────────────────────────────────────────────────────────────────────

const { query, pool } = require('../config/db');
const { getTeacherId } = require('./teacherStatsController');

// GET /api/attendance
// Query params: class_id, subject_id, attendance_date, student_id
const getAttendance = async (req, res, next) => {
  try {
    const { class_id, subject_id, attendance_date, student_id } = req.query;

    let sql = `
      SELECT att.*,
             s.student_id AS student_code, s.full_name AS student_name, s.full_name_kh,
             c.class_code, c.class_name,
             sub.subject_code, sub.subject_name,
             t.full_name AS teacher_name
      FROM attendance att
      JOIN students s ON att.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      JOIN subjects sub ON att.subject_id = sub.id
      JOIN teachers t ON att.teacher_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (class_id) {
      sql += ' AND s.class_id = ?';
      params.push(class_id);
    }
    if (subject_id) {
      sql += ' AND att.subject_id = ?';
      params.push(subject_id);
    }
    if (attendance_date) {
      sql += ' AND att.attendance_date = ?';
      params.push(attendance_date);
    }
    if (student_id) {
      sql += ' AND att.student_id = ?';
      params.push(student_id);
    }

    sql += ' ORDER BY att.attendance_date DESC, s.student_id ASC';

    const records = await query(sql, params);
    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/attendance/batch
// Body: { class_id, subject_id, attendance_date, records: [ { student_id, status, remark } ] }
const recordAttendanceBatch = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { subject_id, attendance_date, records } = req.body;
    let teacherId = await getTeacherId(req);

    if (!teacherId && req.user && req.user.role === 'admin') {
      teacherId = req.body.teacher_id;
      if (!teacherId) {
        const [sch] = await connection.query('SELECT teacher_id FROM schedules WHERE subject_id = ? LIMIT 1', [subject_id]);
        if (sch.length > 0) teacherId = sch[0].teacher_id;
      }
      if (!teacherId) {
        const [anyT] = await connection.query('SELECT id FROM teachers LIMIT 1');
        if (anyT.length > 0) teacherId = anyT[0].id;
      }
    }

    if (!subject_id || !attendance_date || !records || !Array.isArray(records)) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'subject_id, attendance_date, and records array are required.'
      });
    }

    if (!teacherId) {
      connection.release();
      return res.status(403).json({ success: false, message: 'Teacher identity not found.' });
    }

    await connection.beginTransaction();

    for (const rec of records) {
      const { student_id, status, remark } = rec;
      if (!student_id) continue;

      const validStatus = ['present', 'absent', 'late', 'permission'].includes(status) ? status : 'present';

      await connection.query(
        `INSERT INTO attendance (student_id, subject_id, teacher_id, attendance_date, status, remark)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           status     = VALUES(status),
           remark     = VALUES(remark),
           teacher_id = VALUES(teacher_id)`,
        [student_id, subject_id, teacherId, attendance_date, validStatus, remark || null]
      );
    }

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      message: `Successfully saved attendance for ${records.length} students on ${attendance_date}.`
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};

// PUT /api/attendance/:id
const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const existing = await query('SELECT * FROM attendance WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    await query(
      `UPDATE attendance
       SET status = COALESCE(?, status),
           remark = COALESCE(?, remark)
       WHERE id = ?`,
      [status || null, remark !== undefined ? remark : null, id]
    );

    const updated = await query('SELECT * FROM attendance WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Attendance record updated.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/attendance/summary
// Query params: class_id, subject_id, student_id
const getAttendanceSummary = async (req, res, next) => {
  try {
    const { class_id, subject_id, student_id } = req.query;
    let sql = `
      SELECT att.status, COUNT(*) as count
      FROM attendance att
      JOIN students s ON att.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (class_id) {
      sql += ' AND s.class_id = ?';
      params.push(class_id);
    }
    if (subject_id) {
      sql += ' AND att.subject_id = ?';
      params.push(subject_id);
    }
    if (student_id) {
      sql += ' AND att.student_id = ?';
      params.push(student_id);
    }

    sql += ' GROUP BY att.status';

    const counts = await query(sql, params);
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      permission: 0,
      total: 0
    };

    counts.forEach(row => {
      if (summary[row.status] !== undefined) {
        summary[row.status] = Number(row.count);
        summary.total += Number(row.count);
      }
    });

    const rate = summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 100;

    res.json({
      success: true,
      data: {
        ...summary,
        attendanceRate: rate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendance,
  recordAttendanceBatch,
  updateAttendance,
  getAttendanceSummary
};
