// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
require('dotenv').config(); // For .env secret keys

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ivy_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4'],
  },
});

const upload = multer({ storage: storage });

// Models
const User = require('./models/User');

// Signup Route
app.post('/signup', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, email, password, bio, location } = req.body;
    const profilePic = req.file ? req.file.path : '/images/default-profile.jpg';
    const newUser = new User({ username, email, password, profilePic, bio, location });
    await newUser.save();
    res.status(201).json({ success: true, userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Upload Music Route
app.post('/upload-music', upload.single('musicFile'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const musicLink = req.file ? req.file.path : null;
    if (!musicLink) throw new Error('No music uploaded.');

    await User.findByIdAndUpdate(userId, { music: musicLink });
    res.status(200).send('Music uploaded!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Profile route
app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const posts = []; // You can fetch posts later

    res.json({ user, posts });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Home Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));