// cloudinary.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your own credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ivy_uploads', // This is the folder it will save inside Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp3', 'mp4'],
  },
});

const multerUpload = multer({ storage: storage });
module.exports = { 
    cloudinary, 
    storage,
    multerUpload }; 