const multer = require('multer');
const fs=require('fs')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads' directory exists, or create it if it doesn't
    const uploadDir = 'uploads/';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use a unique filename, including the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;