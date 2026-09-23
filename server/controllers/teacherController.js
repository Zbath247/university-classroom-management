// server/controllers/teacherController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Teacher entities and linked user accounts.
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');
const { query, pool } = require('../config/db');

// GET /api/teachers
const getTeachers = async (req, res, next) => {
  try {
    const { search, department } = req.query;
    let sql = `
      SELECT t.*, u.username, u.is_active
      FROM teachers t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (department) {
      sql += ' AND t.department = ?';
      params.push(department);
    }

    if (search) {
      sql += ' AND (t.full_name LIKE ? OR t.teacher_id LIKE ? OR t.email LIKE ? OR t.department LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY t.teacher_id ASC';

    const teachers = await query(sql, params);
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/teachers/:id
const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teachers = await query(
      `SELECT t.*, u.username, u.is_active
       FROM teachers t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    if (teachers.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    // Get assigned schedules/classes
    const schedules = await query(
      `SELECT sch.*, c.class_code, c.class_name, sub.subject_code, sub.subject_name
       FROM schedules sch
       JOIN classes c ON sch.class_id = c.id
       JOIN subjects sub ON sch.subject_id = sub.id
       WHERE sch.teacher_id = ?
       ORDER BY sch.day_of_week, sch.start_time`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...teachers[0],
        schedules
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/teachers
const createTeacher = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { teacher_id, full_name, gender, email, phone, department, username, password } = req.body;

    if (!teacher_id || !full_name || !email) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'teacher_id, full_name, and email are required.'
      });
    }

    const cleanTeacherId = teacher_id.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanTeacherId.toLowerCase().replace(/[^a-z0-9]/g, '')).trim();

    // Check duplicate teacher_id or email
    const [existing] = await connection.query(
      'SELECT id FROM teachers WHERE teacher_id = ? OR email = ?',
      [cleanTeacherId, cleanEmail]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'Teacher ID or email already exists.'
      });
    }

    await connection.beginTransaction();

    // 1. Create User
    const hashedPassword = await bcrypt.hash(password || 'Teacher@123', 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (username, email, password, role, is_active)
       VALUES (?, ?, ?, 'teacher', 1)`,
      [cleanUsername, cleanEmail, hashedPassword]
    );
    const userId = userResult.insertId;

    // 2. Create Teacher
    const [teacherResult] = await connection.query(
      `INSERT INTO teachers (user_id, teacher_id, full_name, gender, email, phone, department)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cleanTeacherId,
        full_name.trim(),
        gender || 'male',
        cleanEmail,
        phone ? phone.trim() : null,
        department ? department.trim() : null
      ]
    );

    await connection.commit();
    connection.release();

    const created = await query(
      `SELECT t.*, u.username
       FROM teachers t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [teacherResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully with login account.',
      data: created[0]
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};

// PUT /api/teachers/:id
const updateTeacher = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { teacher_id, full_name, gender, email, phone, department, is_active, new_password } = req.body;

    const [existing] = await connection.query('SELECT * FROM teachers WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }
    const teacher = existing[0];

    await connection.beginTransaction();

    if (teacher_id && teacher_id.trim().toUpperCase() !== teacher.teacher_id) {
      const [dup] = await connection.query(
        'SELECT id FROM teachers WHERE teacher_id = ? AND id != ?',
        [teacher_id.trim().toUpperCase(), id]
      );
      if (dup.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(409).json({ success: false, message: 'Teacher ID is already in use.' });
      }
    }

    await connection.query(
      `UPDATE teachers
       SET teacher_id = COALESCE(?, teacher_id),
           full_name  = COALESCE(?, full_name),
           gender     = COALESCE(?, gender),
           email      = COALESCE(?, email),
           phone      = COALESCE(?, phone),
           department = COALESCE(?, department)
       WHERE id = ?`,
      [
        teacher_id ? teacher_id.trim().toUpperCase() : null,
        full_name ? full_name.trim() : null,
        gender || null,
        email ? email.trim().toLowerCase() : null,
        phone !== undefined ? phone : null,
        department !== undefined ? department : null,
        id
      ]
    );

    if (email || is_active !== undefined || new_password) {
      let userSql = 'UPDATE users SET ';
      const userParams = [];
      if (email) {
        userSql += 'email = ?, ';
        userParams.push(email.trim().toLowerCase());
      }
      if (is_active !== undefined) {
        userSql += 'is_active = ?, ';
        userParams.push(is_active ? 1 : 0);
      }
      if (new_password) {
        const hashed = await bcrypt.hash(new_password, 10);
        userSql += 'password = ?, ';
        userParams.push(hashed);
      }
      userSql = userSql.slice(0, -2) + ' WHERE id = ?';
      userParams.push(teacher.user_id);
      await connection.query(userSql, userParams);
    }

    await connection.commit();
    connection.release();

    const updated = await query(
      `SELECT t.*, u.username, u.is_active
       FROM teachers t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Teacher updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};

// DELETE /api/teachers/:id
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, user_id, full_name FROM teachers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    const { user_id, full_name } = existing[0];
    await query('DELETE FROM users WHERE id = ?', [user_id]);

    res.json({
      success: true,
      message: `Teacher '${full_name}' and linked user account deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
