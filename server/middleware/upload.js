// server/middleware/upload.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Multer configuration for file uploads (PDF, PowerPoint PPT/PPTX, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads/resources');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize original file name
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\u1780-\u17FF-]/g, '_')
      .substring(0, 80);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext}. Supported: PDF, PowerPoint (PPT/PPTX), Word (DOC/DOCX)`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
