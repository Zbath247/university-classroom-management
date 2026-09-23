// server/controllers/resourceController.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Manage Learning Resources (Documents, Video links, Slides, Web links).
// ─────────────────────────────────────────────────────────────────────────────

const { query } = require('../config/db');
const { getTeacherId } = require('./teacherStatsController');

// GET /api/resources
// Query params: subject_id, teacher_id, resource_type
const getResources = async (req, res, next) => {
  try {
    const { subject_id, teacher_id, resource_type } = req.query;

    let sql = `
      SELECT r.*,
             sub.subject_code, sub.subject_name,
             t.full_name AS teacher_name
      FROM resources r
      JOIN subjects sub ON r.subject_id = sub.id
      JOIN teachers t ON r.teacher_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (subject_id) {
      sql += ' AND r.subject_id = ?';
      params.push(subject_id);
    }
    if (teacher_id) {
      sql += ' AND r.teacher_id = ?';
      params.push(teacher_id);
    }
    if (resource_type) {
      sql += ' AND r.resource_type = ?';
      params.push(resource_type);
    }

    sql += ' ORDER BY r.created_at DESC';

    const resources = await query(sql, params);
    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/resources/:id
const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resources = await query(
      `SELECT r.*,
              sub.subject_code, sub.subject_name,
              t.full_name AS teacher_name
       FROM resources r
       JOIN subjects sub ON r.subject_id = sub.id
       JOIN teachers t ON r.teacher_id = t.id
       WHERE r.id = ?`,
      [id]
    );

    if (resources.length === 0) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    res.json({
      success: true,
      data: resources[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/resources
const path = require('path');

const createResource = async (req, res, next) => {
  try {
    let { subject_id, title, description, file_url, resource_type } = req.body;
    let teacherId = await getTeacherId(req);

    if (!teacherId && req.user && req.user.role === 'admin') {
      teacherId = req.body.teacher_id;
      if (!teacherId) {
        const sch = await query('SELECT teacher_id FROM schedules WHERE subject_id = ? LIMIT 1', [subject_id]);
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

    let fileName = null;
    let fileSize = null;
    let finalFileUrl = file_url ? file_url.trim() : null;

    if (req.file) {
      finalFileUrl = `/uploads/resources/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;

      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        resource_type = 'pdf';
      } else if (ext === '.ppt' || ext === '.pptx') {
        resource_type = 'ppt';
      } else if (['.doc', '.docx'].includes(ext)) {
        resource_type = 'document';
      } else {
        resource_type = resource_type || 'document';
      }
    } else if (finalFileUrl) {
      const lowerUrl = finalFileUrl.toLowerCase();
      if (lowerUrl.endsWith('.pdf')) {
        resource_type = 'pdf';
      } else if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) {
        resource_type = 'ppt';
      } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('vimeo.com')) {
        resource_type = 'video';
      } else {
        resource_type = resource_type || 'link';
      }
    }

    const type = resource_type || 'document';

    const result = await query(
      `INSERT INTO resources (subject_id, teacher_id, title, description, file_url, file_name, file_size, resource_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subject_id,
        teacherId,
        title.trim(),
        description || null,
        finalFileUrl,
        fileName,
        fileSize,
        type
      ]
    );

    const created = await query(
      `SELECT r.*, sub.subject_code, sub.subject_name
       FROM resources r
       JOIN subjects sub ON r.subject_id = sub.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Learning resource uploaded and shared successfully.',
      data: created[0]
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/resources/:id
const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { subject_id, title, description, file_url, resource_type } = req.body;

    const existing = await query('SELECT * FROM resources WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    let fileName = undefined;
    let fileSize = undefined;
    let finalFileUrl = file_url !== undefined ? (file_url ? file_url.trim() : null) : undefined;

    if (req.file) {
      finalFileUrl = `/uploads/resources/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;

      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        resource_type = 'pdf';
      } else if (ext === '.ppt' || ext === '.pptx') {
        resource_type = 'ppt';
      } else if (['.doc', '.docx'].includes(ext)) {
        resource_type = 'document';
      }
    }

    await query(
      `UPDATE resources
       SET subject_id    = COALESCE(?, subject_id),
           title         = COALESCE(?, title),
           description   = COALESCE(?, description),
           file_url      = COALESCE(?, file_url),
           file_name     = COALESCE(?, file_name),
           file_size     = COALESCE(?, file_size),
           resource_type = COALESCE(?, resource_type)
       WHERE id = ?`,
      [
        subject_id || null,
        title ? title.trim() : null,
        description !== undefined ? description : null,
        finalFileUrl !== undefined ? finalFileUrl : null,
        fileName !== undefined ? fileName : null,
        fileSize !== undefined ? fileSize : null,
        resource_type || null,
        id
      ]
    );

    const updated = await query(
      `SELECT r.*, sub.subject_code, sub.subject_name
       FROM resources r
       JOIN subjects sub ON r.subject_id = sub.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Resource updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/resources/:id
const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM resources WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Resource not found.' });
    }

    await query('DELETE FROM resources WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Resource deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
