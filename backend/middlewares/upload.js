const multer = require("multer");

// Files are held in memory, then streamed to Cloudinary from the controller.
// 25 MB cap so a huge upload can't fill the process memory.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = upload;
