// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

require('dotenv').config(); 

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
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp3', 'mp4', 'webm'],
    transformation: [{ width:500, height: 500, crop: 'limit' }]
  }
});

module.exports = { cloudinary,  storage,}; 