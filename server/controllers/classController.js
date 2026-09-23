// server/controllers/classController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Class entities (CRUD operations).
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');

// GET /api/classes
const getClasses = async (req, res, next) => {
  try {
    const classes = await query(
      `SELECT c.*, COUNT(s.id) AS student_count
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.id
       GROUP BY c.id
       ORDER BY c.academic_year DESC, c.class_code ASC`
    );
    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/classes/:id
const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const classes = await query(
      `SELECT c.*, COUNT(s.id) AS student_count
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.id
       WHERE c.id = ?
       GROUP BY c.id`,
      [id]
    );

    if (classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.'
      });
    }

    // Also get students in this class
    const students = await query(
      `SELECT id, student_id, full_name, full_name_kh, gender, email, phone
       FROM students
       WHERE class_id = ?
       ORDER BY student_id ASC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...classes[0],
        students
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/classes
const createClass = async (req, res, next) => {
  try {
    const { class_code, class_name, academic_year, description } = req.body;

    if (!class_code || !class_name || !academic_year) {
      return res.status(400).json({
        success: false,
        message: 'class_code, class_name, and academic_year are required.'
      });
    }

    // Check duplicate code
    const existing = await query('SELECT id FROM classes WHERE class_code = ?', [class_code.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Class code '${class_code}' already exists.`
      });
    }

    const result = await query(
      `INSERT INTO classes (class_code, class_name, academic_year, description)
       VALUES (?, ?, ?, ?)`,
      [class_code.trim().toUpperCase(), class_name.trim(), academic_year.trim(), description || null]
    );

    const newClass = await query('SELECT * FROM classes WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Class created successfully.',
      data: newClass[0]
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/classes/:id
const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { class_code, class_name, academic_year, description } = req.body;

    const existing = await query('SELECT * FROM classes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Class not found.' });
    }

    if (class_code) {
      const duplicate = await query(
        'SELECT id FROM classes WHERE class_code = ? AND id != ?',
        [class_code.trim(), id]
      );
      if (duplicate.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Class code '${class_code}' is already in use by another class.`
        });
      }
    }

    await query(
      `UPDATE classes
       SET class_code    = COALESCE(?, class_code),
           class_name    = COALESCE(?, class_name),
           academic_year = COALESCE(?, academic_year),
           description   = COALESCE(?, description)
       WHERE id = ?`,
      [
        class_code ? class_code.trim().toUpperCase() : null,
        class_name ? class_name.trim() : null,
        academic_year ? academic_year.trim() : null,
        description !== undefined ? description : null,
        id
      ]
    );

    const updated = await query('SELECT * FROM classes WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Class updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/classes/:id
const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, class_code FROM classes WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Class not found.' });
    }

    await query('DELETE FROM classes WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Class '${existing[0].class_code}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};
