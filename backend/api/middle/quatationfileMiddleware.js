const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Storage configuration for PDF uploads
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "quotationuploads/";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Ensuring unique file names
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s/g, "_"));
  },
});

// Middleware for handling PDF uploads
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Not a PDF file"), false);
    }
  },
});

module.exports = pdfUpload;
