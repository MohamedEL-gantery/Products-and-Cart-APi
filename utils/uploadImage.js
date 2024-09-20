const multer = require("multer");
const AppError = require("../utils/appError");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Ensure the public directory exists
const uploadDir = path.join(__dirname, "../public");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up the disk storage configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where files should be saved
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp, random string, and original file extension
    const ext = path.extname(file.originalname);
    const randomStr = crypto.randomBytes(6).toString("hex");
    cb(null, `image-${Date.now()}-${randomStr}${ext}`);
  },
});

/**
 * Multer options
 *
 * @return upload options for multer
 */
const multerOptions = () => {
  // 1- Check if file is an image
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(AppError.badRequest("Not an image, please upload only images."), false);
    }
  };

  // 2- Upload using diskStorage with file size limit
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  });

  // 3- Return the configured upload object
  return upload;
};

// Multer upload for a single image
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
