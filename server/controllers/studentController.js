// server/controllers/studentController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Student entities and their linked user accounts.
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');
const { query, pool } = require('../config/db');

// GET /api/students
// Query params: class_id, search, limit, offset
const getStudents = async (req, res, next) => {
  try {
    const { class_id, search } = req.query;
    let sql = `
      SELECT s.*, c.class_code, c.class_name, u.username, u.is_active
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (class_id) {
      sql += ' AND s.class_id = ?';
      params.push(class_id);
    }

    if (search) {
      sql += ' AND (s.full_name LIKE ? OR s.full_name_kh LIKE ? OR s.student_id LIKE ? OR s.email LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY s.student_id ASC';

    const students = await query(sql, params);
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/students/:id
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const students = await query(
      `SELECT s.*, c.class_code, c.class_name, u.username, u.is_active
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    res.json({
      success: true,
      data: students[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/students
const createStudent = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const {
      student_id,
      full_name,
      full_name_kh,
      gender,
      date_of_birth,
      phone,
      email,
      class_id,
      username,
      password
    } = req.body;

    if (!student_id || !full_name || !email) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'student_id, full_name, and email are required.'
      });
    }

    const cleanStudentId = student_id.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanStudentId.toLowerCase().replace(/[^a-z0-9]/g, '')).trim();

    // Check duplicate student_id or email
    const [existingStudent] = await connection.query(
      'SELECT id FROM students WHERE student_id = ? OR email = ?',
      [cleanStudentId, cleanEmail]
    );
    if (existingStudent.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: 'Student ID or email already exists.'
      });
    }

    // Check duplicate username in users table
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [cleanUsername, cleanEmail]
    );
    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({
        success: false,
        message: `Username '${cleanUsername}' or email '${cleanEmail}' is already registered.`
      });
    }

    await connection.beginTransaction();

    // 1. Hash password & create user record
    const hashedPassword = await bcrypt.hash(password || 'Student@123', 10);
    const [userResult] = await connection.query(
      `INSERT INTO users (username, email, password, role, is_active)
       VALUES (?, ?, ?, 'student', 1)`,
      [cleanUsername, cleanEmail, hashedPassword]
    );
    const userId = userResult.insertId;

    // 2. Create student profile
    const [studentResult] = await connection.query(
      `INSERT INTO students
         (user_id, student_id, full_name, full_name_kh, gender, date_of_birth, phone, email, class_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cleanStudentId,
        full_name.trim(),
        full_name_kh ? full_name_kh.trim() : null,
        gender || 'male',
        date_of_birth || null,
        phone ? phone.trim() : null,
        cleanEmail,
        class_id || null
      ]
    );

    await connection.commit();
    connection.release();

    const created = await query(
      `SELECT s.*, c.class_code, c.class_name, u.username
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [studentResult.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Student created successfully with login account.',
      data: created[0]
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const {
      student_id,
      full_name,
      full_name_kh,
      gender,
      date_of_birth,
      phone,
      email,
      class_id,
      is_active,
      new_password
    } = req.body;

    const [existing] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    const student = existing[0];

    await connection.beginTransaction();

    // Check duplicate student_id
    if (student_id && student_id.trim().toUpperCase() !== student.student_id) {
      const [dup] = await connection.query(
        'SELECT id FROM students WHERE student_id = ? AND id != ?',
        [student_id.trim().toUpperCase(), id]
      );
      if (dup.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(409).json({ success: false, message: 'Student ID already in use.' });
      }
    }

    // Check duplicate email
    if (email && email.trim().toLowerCase() !== (student.email || '').toLowerCase()) {
      const [dupEmail] = await connection.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email.trim().toLowerCase(), student.user_id]
      );
      if (dupEmail.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(409).json({ success: false, message: 'Email already in use.' });
      }
    }

    // Update students table
    await connection.query(
      `UPDATE students
       SET student_id    = COALESCE(?, student_id),
           full_name     = COALESCE(?, full_name),
           full_name_kh  = COALESCE(?, full_name_kh),
           gender        = COALESCE(?, gender),
           date_of_birth = COALESCE(?, date_of_birth),
           phone         = COALESCE(?, phone),
           email         = COALESCE(?, email),
           class_id      = COALESCE(?, class_id)
       WHERE id = ?`,
      [
        student_id ? student_id.trim().toUpperCase() : null,
        full_name ? full_name.trim() : null,
        full_name_kh !== undefined ? full_name_kh : null,
        gender || null,
        date_of_birth || null,
        phone !== undefined ? phone : null,
        email ? email.trim().toLowerCase() : null,
        class_id !== undefined ? (class_id ? Number(class_id) : null) : null,
        id
      ]
    );

    // Update linked user table if email or is_active or new_password changed
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
      userParams.push(student.user_id);
      await connection.query(userSql, userParams);
    }

    await connection.commit();
    connection.release();

    const updated = await query(
      `SELECT s.*, c.class_code, c.class_name, u.username, u.is_active
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Student updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, user_id, full_name FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const { user_id, full_name } = existing[0];

    // Deleting from users automatically cascades to students table via FK constraint
    await query('DELETE FROM users WHERE id = ?', [user_id]);

    res.json({
      success: true,
      message: `Student '${full_name}' and linked user account deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
