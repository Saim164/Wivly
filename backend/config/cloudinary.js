const cloudinary = require("cloudinary").v2;

// Two ways to configure:
//  - set CLOUDINARY_URL (the single line Cloudinary shows on the dashboard), or
//  - set CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Streams an in-memory file buffer to Cloudinary and resolves with the result
// ({ secure_url, public_id, ... }). resource_type "auto" handles images + video.
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "wivly", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(fileBuffer);
  });

module.exports = { cloudinary, uploadToCloudinary };
