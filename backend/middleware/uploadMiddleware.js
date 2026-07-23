import multer from "multer";
import fs from "fs";
import path from "path";

/* ==========================================================
   UPLOAD DIRECTORY
========================================================== */

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "chat"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* ==========================================================
   ALLOWED MIME TYPES
========================================================== */

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",

  // Documents
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Archives
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",

  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",

  // Video
  "video/mp4",
  "video/webm",
  "video/x-msvideo",
  "video/quicktime",
];

/* ==========================================================
   STORAGE
========================================================== */

const storage = multer.diskStorage({

  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {

    const extension = path.extname(file.originalname);

    const fileName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, fileName);
  },

});

/* ==========================================================
   FILE FILTER
========================================================== */

const fileFilter = (req, file, cb) => {

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(`Unsupported file type: ${file.mimetype}`),
      false
    );
  }

  cb(null, true);

};

/* ==========================================================
   MULTER INSTANCE
========================================================== */

const upload = multer({

  storage,

  fileFilter,

  limits: {
    files: 10,
    fileSize: 50 * 1024 * 1024, // 50MB
  },

});

/* ==========================================================
   MIDDLEWARES
========================================================== */

export const uploadSingle =
  upload.single("attachment");

export const uploadMultiple =
  upload.array("attachments", 10);

/* ==========================================================
   ERROR HANDLER
========================================================== */

export const uploadErrorHandler = (
  err,
  req,
  res,
  next
) => {

  if (!err) return next();

  if (err instanceof multer.MulterError) {

    switch (err.code) {

      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "Maximum file size is 50MB.",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Maximum 10 files are allowed.",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected file field.",
        });

      default:
        return res.status(400).json({
          success: false,
          message: err.message,
        });

    }

  }

  return res.status(400).json({
    success: false,
    message: err.message || "File upload failed.",
  });

};

/* ==========================================================
   EXPORT
========================================================== */

export default upload;