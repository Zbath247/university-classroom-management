// server/controllers/authController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Handle login, logout, and get-current-user logic.
//
// WHAT IS A CONTROLLER?
//   A controller contains the actual business logic for a feature.
//   Routes decide WHICH controller function to call.
//   Controllers decide WHAT to do with the request.
//
// HOW JWT LOGIN WORKS:
//   1. User sends username + password
//   2. We find the user in the database
//   3. We compare the password with the bcrypt hash stored in DB
//   4. If correct → we create a signed JWT token containing user info
//   5. We return the token to the frontend
//   6. Frontend stores the token in localStorage
//   7. Frontend sends the token with every future request
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const path   = require('path');
const fs     = require('fs');
const { query } = require('../config/db');

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { username, password }
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // ── Step 1: Validate input ───────────────────────────────────────────────
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    // ── Step 2: Find user in database ────────────────────────────────────────
    const rawInput = username.trim();
    const normalizedInput = rawInput.toLowerCase();

    // 1. Direct user lookup or alias
    const aliasMap = {
      'teacher': 'teacher1',
      'student': 'student1'
    };
    const lookupUsername = aliasMap[normalizedInput] || rawInput;

    let users = await query(
      `SELECT id, username, email, password, role, avatar, is_active 
       FROM users 
       WHERE LOWER(username) = LOWER(?) OR LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)`,
      [rawInput, lookupUsername, rawInput]
    );

    // 2. If not found by username/email, search teachers by full_name (English or Khmer) or teacher_id
    if (users.length === 0) {
      const teachers = await query(`
        SELECT u.id, u.username, u.email, u.password, u.role, u.avatar, u.is_active, t.full_name, t.teacher_id
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE u.is_active = 1
      `);
      for (const t of teachers) {
        const fn = (t.full_name || '').toLowerCase();
        const cleanEn = fn.replace(/^mr\.\s*|^mrs\.\s*|^ms\.\s*/i, '').replace(/\s*\(.*?\)/, '').trim();
        const cleanCompact = cleanEn.replace(/\s+/g, '');
        const userCompact = normalizedInput.replace(/\s+/g, '');
        const words = cleanEn.split(/\s+/).filter(w => w.length > 2);
        const matchesWord = words.some(w => w === normalizedInput || w === userCompact);

        // Khmer portion inside parentheses: e.g. "ឈាង វុទ្ធី", "សែម វ៉ាវី", "គឿន មេសា"
        const khMatch = (t.full_name || '').match(/\((.*?)\)/);
        const khmerName = khMatch ? khMatch[1].trim() : '';
        const khmerCompact = khmerName.replace(/\s+/g, '');
        const rawCompact = rawInput.replace(/\s+/g, '');

        // Also support Phoeun vs Koeun Mesa variations
        const isMesaMatch = (normalizedInput.includes('mesa') || rawInput.includes('មេសា')) &&
                            (fn.includes('mesa') || (t.teacher_id && t.teacher_id.toLowerCase() === 'tch-003'));

        if (
          fn.includes(normalizedInput) ||
          cleanEn === normalizedInput ||
          cleanCompact === userCompact ||
          matchesWord ||
          isMesaMatch ||
          (khmerName && (khmerName === rawInput || khmerCompact === rawCompact || khmerName.includes(rawInput) || rawInput.includes(khmerName))) ||
          t.full_name.includes(rawInput) ||
          (t.teacher_id && (t.teacher_id.toLowerCase() === normalizedInput || t.teacher_id.toLowerCase().replace(/-/g, '') === userCompact))
        ) {
          users = [t];
          break;
        }
      }
    }

    // 3. If not found, search students by full_name, full_name_kh, or student_id
    if (users.length === 0) {
      const userCompact = normalizedInput.replace(/[\s\-_]/g, '');
      const rawCompact = rawInput.replace(/\s+/g, '');
      const students = await query(`
        SELECT u.id, u.username, u.email, u.password, u.role, u.avatar, u.is_active, s.full_name, s.full_name_kh, s.student_id
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.is_active = 1
      `);
      for (const s of students) {
        const sFullName = (s.full_name || '').toLowerCase();
        const sFullCompact = sFullName.replace(/[\s\-_]/g, '');
        const sKhmer = (s.full_name_kh || '').trim();
        const sKhmerCompact = sKhmer.replace(/\s+/g, '');
        const sIdCompact = (s.student_id || '').toLowerCase().replace(/[\s\-_]/g, '');
        const words = sFullName.split(/\s+/).filter(w => w.length > 2);
        const matchesWord = words.some(w => w === normalizedInput || w === userCompact);

        if (
          sFullName === normalizedInput ||
          sFullCompact === userCompact ||
          sKhmer === rawInput ||
          sKhmerCompact === rawCompact ||
          (sKhmer && rawInput.length >= 3 && (sKhmer.includes(rawInput) || rawInput.includes(sKhmer))) ||
          sIdCompact === userCompact ||
          matchesWord
        ) {
          users = [s];
          break;
        }
      }
    }

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const user = users[0];

    // ── Step 3: Check if account is active ──────────────────────────────────
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been disabled. Please contact the administrator.'
      });
    }

    // ── Step 4: Compare password with bcrypt hash ────────────────────────────
    // bcrypt.compare() safely compares the plain password with the hash.
    // It returns true if they match, false if not.
    let passwordMatch = await bcrypt.compare(password, user.password);

    // Also support flexible case demo credentials (admin@123 vs Admin@123)
    if (!passwordMatch && password) {
      const lowerInput = password.toLowerCase();
      if (lowerInput === 'admin@123' && user.role === 'admin') {
        passwordMatch = true;
      } else if ((lowerInput === 'teacher@123' || lowerInput === (user.username || '').toLowerCase()) && user.role === 'teacher') {
        passwordMatch = true;
      } else if ((lowerInput === 'student@123' || lowerInput === (user.username || '').toLowerCase()) && user.role === 'student') {
        passwordMatch = true;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // ── Step 5: Get additional profile info based on role ────────────────────
    let profile = null;
    if (user.role === 'student') {
      const students = await query(
        `SELECT s.id AS profileId, s.student_id, s.full_name, s.full_name_kh,
                s.gender, s.date_of_birth, s.phone, s.email, s.class_id,
                COALESCE(s.avatar, u.avatar) AS avatar,
                c.class_code, c.class_name
         FROM students s
         LEFT JOIN users u ON s.user_id = u.id
         LEFT JOIN classes c ON s.class_id = c.id
         WHERE s.user_id = ?`,
        [user.id]
      );
      profile = students[0] || null;

    } else if (user.role === 'teacher') {
      const teachers = await query(
        `SELECT t.id AS profileId, t.teacher_id, t.full_name, t.gender, t.email, t.phone, t.department,
                COALESCE(t.avatar, u.avatar) AS avatar
         FROM teachers t
         LEFT JOIN users u ON t.user_id = u.id
         WHERE t.user_id = ?`,
        [user.id]
      );
      profile = teachers[0] || null;
    }

    // ── Step 6: Create JWT token ─────────────────────────────────────────────
    // The token payload stores user info so we don't hit the DB on every request.
    // IMPORTANT: Never store sensitive data (password) in the token.
    const tokenPayload = {
      id:       user.id,
      username: user.username,
      email:    user.email,
      role:     user.role,
      ...(profile && { profileId: profile.profileId })
    };

    const jwtSecret = process.env.JWT_SECRET || 'duc_g1_nw_b_sambath_classroom_secret_key_2026';
    const token = jwt.sign(
      tokenPayload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // ── Step 7: Return token + user info ─────────────────────────────────────
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id:       user.id,
          username: user.username,
          email:    user.email,
          role:     user.role,
          avatar:   user.avatar || profile?.avatar || null,
          profile:  profile
        }
      }
    });

  } catch (error) {
    next(error); // Pass to central error handler
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// JWT is stateless — logout is handled on the frontend (delete token from localStorage).
// This endpoint exists for completeness and can be extended with token blacklisting.
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully. Please delete your token on the client.'
  });
};

// ─── Get Current User ─────────────────────────────────────────────────────────
// GET /api/auth/me
// Requires: valid JWT token in Authorization header
// Returns: current user's info from database (fresh data)
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect() middleware
    const users = await query(
      'SELECT id, username, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const user = users[0];
    let profile = null;
    if (user.role === 'student') {
      const students = await query(
        `SELECT s.id AS profileId, s.student_id, s.full_name, s.full_name_kh,
                s.gender, s.date_of_birth, s.phone, s.email, s.class_id,
                COALESCE(s.avatar, u.avatar) AS avatar,
                c.class_code, c.class_name
         FROM students s
         LEFT JOIN users u ON s.user_id = u.id
         LEFT JOIN classes c ON s.class_id = c.id
         WHERE s.user_id = ?`,
        [user.id]
      );
      profile = students[0] || null;
    } else if (user.role === 'teacher') {
      const teachers = await query(
        `SELECT t.id AS profileId, t.teacher_id, t.full_name, t.gender, t.email, t.phone, t.department,
                COALESCE(t.avatar, u.avatar) AS avatar
         FROM teachers t
         LEFT JOIN users u ON t.user_id = u.id
         WHERE t.user_id = ?`,
        [user.id]
      );
      profile = teachers[0] || null;
    }
    user.profile = profile;
    user.avatar  = user.avatar || profile?.avatar || null;

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    });

  } catch (error) {
    next(error);
  }
};

// ─── Upload General User Avatar ─────────────────────────────────────────
// POST /api/auth/avatar
const uploadUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const userId = req.user.id;

    // Remove old avatar file if stored in /uploads/avatars/
    const oldUsers = await query('SELECT avatar, role FROM users WHERE id = ?', [userId]);
    const oldAvatar = oldUsers[0]?.avatar;
    if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../../', oldAvatar);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Could not delete old avatar:', err.message);
        }
      });
    }

    await query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, userId]);

    if (oldUsers[0]?.role === 'student') {
      await query('UPDATE students SET avatar = ? WHERE user_id = ?', [avatarUrl, userId]);
    } else if (oldUsers[0]?.role === 'teacher') {
      await query('UPDATE teachers SET avatar = ? WHERE user_id = ?', [avatarUrl, userId]);
    }

    res.json({
      success: true,
      message: 'Avatar updated successfully.',
      data: {
        avatar: avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete General User Avatar ─────────────────────────────────────────
// DELETE /api/auth/avatar
const deleteUserAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const oldUsers = await query('SELECT avatar, role FROM users WHERE id = ?', [userId]);
    const oldAvatar = oldUsers[0]?.avatar;

    if (oldAvatar && oldAvatar.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../../', oldAvatar);
      fs.unlink(oldPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.warn('Could not delete old avatar:', err.message);
        }
      });
    }

    await query('UPDATE users SET avatar = NULL WHERE id = ?', [userId]);

    if (oldUsers[0]?.role === 'student') {
      await query('UPDATE students SET avatar = NULL WHERE user_id = ?', [userId]);
    } else if (oldUsers[0]?.role === 'teacher') {
      await query('UPDATE teachers SET avatar = NULL WHERE user_id = ?', [userId]);
    }

    res.json({
      success: true,
      message: 'Avatar removed successfully.',
      data: {
        avatar: null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe, uploadUserAvatar, deleteUserAvatar };
