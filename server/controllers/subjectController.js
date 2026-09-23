// server/controllers/subjectController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Subject entities (CRUD operations).
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');

// GET /api/subjects
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await query('SELECT * FROM subjects ORDER BY subject_code ASC');
    res.json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subjects/:id
const getSubjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subjects = await query('SELECT * FROM subjects WHERE id = ?', [id]);

    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.'
      });
    }

    res.json({
      success: true,
      data: subjects[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/subjects
const createSubject = async (req, res, next) => {
  try {
    const { subject_code, subject_name, credits, description } = req.body;

    if (!subject_code || !subject_name) {
      return res.status(400).json({
        success: false,
        message: 'subject_code and subject_name are required.'
      });
    }

    const existing = await query('SELECT id FROM subjects WHERE subject_code = ?', [subject_code.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Subject code '${subject_code}' already exists.`
      });
    }

    const result = await query(
      `INSERT INTO subjects (subject_code, subject_name, credits, description)
       VALUES (?, ?, ?, ?)`,
      [subject_code.trim().toUpperCase(), subject_name.trim(), credits || 3, description || null]
    );

    const newSubject = await query('SELECT * FROM subjects WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
      data: newSubject[0]
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject_code, subject_name, credits, description } = req.body;

    const existing = await query('SELECT * FROM subjects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }

    if (subject_code) {
      const duplicate = await query(
        'SELECT id FROM subjects WHERE subject_code = ? AND id != ?',
        [subject_code.trim(), id]
      );
      if (duplicate.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Subject code '${subject_code}' is already used.`
        });
      }
    }

    await query(
      `UPDATE subjects
       SET subject_code = COALESCE(?, subject_code),
           subject_name = COALESCE(?, subject_name),
           credits      = COALESCE(?, credits),
           description  = COALESCE(?, description)
       WHERE id = ?`,
      [
        subject_code ? subject_code.trim().toUpperCase() : null,
        subject_name ? subject_name.trim() : null,
        credits !== undefined ? credits : null,
        description !== undefined ? description : null,
        id
      ]
    );

    const updated = await query('SELECT * FROM subjects WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Subject updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, subject_code FROM subjects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }

    await query('DELETE FROM subjects WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Subject '${existing[0].subject_code}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
