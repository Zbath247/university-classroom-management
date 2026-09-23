// server/controllers/scheduleController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Schedules/Timetables.
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');

// GET /api/schedules
// Query params: class_id, teacher_id, day_of_week
const getSchedules = async (req, res, next) => {
  try {
    const { class_id, teacher_id, day_of_week } = req.query;
    let sql = `
      SELECT sch.*,
             c.class_code, c.class_name,
             sub.subject_code, sub.subject_name, sub.credits,
             t.full_name AS teacher_name, t.teacher_id AS teacher_code, t.department
      FROM schedules sch
      JOIN classes c ON sch.class_id = c.id
      JOIN subjects sub ON sch.subject_id = sub.id
      JOIN teachers t ON sch.teacher_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (class_id) {
      sql += ' AND sch.class_id = ?';
      params.push(class_id);
    }
    if (teacher_id) {
      sql += ' AND sch.teacher_id = ?';
      params.push(teacher_id);
    }
    if (day_of_week) {
      sql += ' AND sch.day_of_week = ?';
      params.push(day_of_week);
    }

    sql += `
      ORDER BY FIELD(sch.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
               sch.start_time ASC
    `;

    const schedules = await query(sql, params);
    res.json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/schedules/:id
const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedules = await query(
      `SELECT sch.*,
              c.class_code, c.class_name,
              sub.subject_code, sub.subject_name,
              t.full_name AS teacher_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.id = ?`,
      [id]
    );

    if (schedules.length === 0) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }

    res.json({
      success: true,
      data: schedules[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/schedules
const createSchedule = async (req, res, next) => {
  try {
    const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room } = req.body;

    if (!class_id || !subject_id || !teacher_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'class_id, subject_id, teacher_id, day_of_week, start_time, and end_time are required.'
      });
    }

    const result = await query(
      `INSERT INTO schedules (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room || null]
    );

    const [created] = await query(
      `SELECT sch.*,
              c.class_code, c.class_name,
              sub.subject_code, sub.subject_name,
              t.full_name AS teacher_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully.',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/schedules/:id
const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room } = req.body;

    const existing = await query('SELECT * FROM schedules WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }

    await query(
      `UPDATE schedules
       SET class_id    = COALESCE(?, class_id),
           subject_id  = COALESCE(?, subject_id),
           teacher_id  = COALESCE(?, teacher_id),
           day_of_week = COALESCE(?, day_of_week),
           start_time  = COALESCE(?, start_time),
           end_time    = COALESCE(?, end_time),
           room        = COALESCE(?, room)
       WHERE id = ?`,
      [
        class_id || null,
        subject_id || null,
        teacher_id || null,
        day_of_week || null,
        start_time || null,
        end_time || null,
        room !== undefined ? room : null,
        id
      ]
    );

    const [updated] = await query(
      `SELECT sch.*,
              c.class_code, c.class_name,
              sub.subject_code, sub.subject_name,
              t.full_name AS teacher_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       JOIN teachers t ON sch.teacher_id = t.id
       WHERE sch.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Schedule updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/schedules/:id
const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM schedules WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Schedule not found.' });
    }

    await query('DELETE FROM schedules WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Schedule deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule
};
