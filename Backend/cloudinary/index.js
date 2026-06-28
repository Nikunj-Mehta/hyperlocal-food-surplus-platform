// Cloudinary configuration
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const localUploadDir = path.join(__dirname, '..', 'uploads', 'food-surplus');
fs.mkdirSync(localUploadDir, { recursive: true });

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'food-surplus',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, localUploadDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
      },
    });

module.exports = { cloudinary, storage, hasCloudinaryConfig };
