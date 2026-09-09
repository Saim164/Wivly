const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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
