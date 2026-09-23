// server/middleware/uploadAvatar.js
// ─────────────────────────────────────────────────────────────────────────────
// PURPOSE: Multer configuration for user/student profile image uploads.
// ─────────────────────────────────────────────────────────────────────────────

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const userId = req.user ? req.user.id : 'guest';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `avatar-${userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(ext) && file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${ext || 'unknown'}. Allowed formats: PNG, JPG, JPEG, WEBP, GIF.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter: fileFilter
});

// Middleware wrapper that captures Multer errors cleanly as JSON
const uploadAvatarMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('avatar');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed size is 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Error processing image upload.'
      });
    }
    next();
  });
};

module.exports = {
  uploadAvatarMiddleware,
  uploadDir
};
