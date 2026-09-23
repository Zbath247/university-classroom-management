// server/controllers/assignmentController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Assignments (Homework, Projects, Quizzes).
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');
const { getTeacherId } = require('./teacherStatsController');

// GET /api/assignments
// Query params: subject_id, class_id, teacher_id
const getAssignments = async (req, res, next) => {
  try {
    const { subject_id, class_id, teacher_id } = req.query;

    let sql = `
      SELECT a.*,
             sub.subject_code, sub.subject_name,
             c.class_code, c.class_name,
             t.full_name AS teacher_name
      FROM assignments a
      JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN classes c ON a.class_id = c.id
      JOIN teachers t ON a.teacher_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id) {
      sql += ' AND a.subject_id = ?';
      params.push(subject_id);
    }
    if (class_id) {
      sql += ' AND a.class_id = ?';
      params.push(class_id);
    }
    if (teacher_id) {
      sql += ' AND a.teacher_id = ?';
      params.push(teacher_id);
    }

    sql += ' ORDER BY a.due_date ASC, a.created_at DESC';

    const assignments = await query(sql, params);
    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/assignments/:id
const getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignments = await query(
      `SELECT a.*,
              sub.subject_code, sub.subject_name,
              c.class_code, c.class_name,
              t.full_name AS teacher_name
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       LEFT JOIN classes c ON a.class_id = c.id
       JOIN teachers t ON a.teacher_id = t.id
       WHERE a.id = ?`,
      [id]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    res.json({
      success: true,
      data: assignments[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/assignments
const createAssignment = async (req, res, next) => {
  try {
    const { subject_id, class_id, title, description, due_date } = req.body;
    let teacherId = await getTeacherId(req);

    if (!teacherId && req.user && req.user.role === 'admin') {
      teacherId = req.body.teacher_id;
      if (!teacherId && class_id) {
        const sch = await query('SELECT teacher_id FROM schedules WHERE subject_id = ? AND class_id = ? LIMIT 1', [subject_id, class_id]);
        if (sch.length > 0) teacherId = sch[0].teacher_id;
      }
      if (!teacherId) {
        const anyT = await query('SELECT id FROM teachers LIMIT 1');
        if (anyT.length > 0) teacherId = anyT[0].id;
      }
    }

    if (!subject_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'subject_id and title are required.'
      });
    }

    if (!teacherId) {
      return res.status(403).json({ success: false, message: 'Teacher identity not found.' });
    }

    const result = await query(
      `INSERT INTO assignments (subject_id, teacher_id, class_id, title, description, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        subject_id,
        teacherId,
        class_id || null,
        title.trim(),
        description || null,
        due_date || null
      ]
    );

    const created = await query(
      `SELECT a.*, sub.subject_code, sub.subject_name, c.class_code
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       LEFT JOIN classes c ON a.class_id = c.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully.',
      data: created[0]
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/assignments/:id
const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject_id, class_id, title, description, due_date } = req.body;

    const existing = await query('SELECT * FROM assignments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    await query(
      `UPDATE assignments
       SET subject_id  = COALESCE(?, subject_id),
           class_id    = COALESCE(?, class_id),
           title       = COALESCE(?, title),
           description = COALESCE(?, description),
           due_date    = COALESCE(?, due_date)
       WHERE id = ?`,
      [
        subject_id || null,
        class_id !== undefined ? (class_id ? Number(class_id) : null) : null,
        title ? title.trim() : null,
        description !== undefined ? description : null,
        due_date || null,
        id
      ]
    );

    const updated = await query(
      `SELECT a.*, sub.subject_code, sub.subject_name, c.class_code
       FROM assignments a
       JOIN subjects sub ON a.subject_id = sub.id
       LEFT JOIN classes c ON a.class_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Assignment updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/assignments/:id
const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM assignments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    await query('DELETE FROM assignments WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Assignment deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
