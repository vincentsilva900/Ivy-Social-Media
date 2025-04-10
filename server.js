require('dotenv').config();
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { cloudinary, storage, multerUpload } = require('./cloudinary');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Load Models
const User = require('./models/User');
const Post = require('./models/Post');

// Signup Route (Upload to Cloudinary)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temporary save

app.post('/signup', multerUpload.single('profilePic'), async (req, res) => {
  try {
    let profilePicUrl = '/images/default-profile.jpg'; // fallback default

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ivy-profile-pics',
        resource_type: 'image'
      });
      profilePicUrl = uploadResult.secure_url;  // URL from Cloudinary
    }

    const { username, email, password, bio, location } = req.body;
    const newUser = new User({
      username,
      email,
      password,
      profilePic: profilePicUrl,
      bio,
      location
    });

    await newUser.save();
    res.status(201).json({ success: true, userId: newUser._id });

  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Upload music file (same setup later if you want to do it)
app.post('/upload-music', multerUpload.single('musicFile'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const musicLink = req.file.path;
    await User.findByIdAndUpdate(userId, { music: musicLink });
    res.status(200).send('Music uploaded!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Fetch profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    const posts = await Post.find({ userId }).sort({ timestamp: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create post
app.post('/create-post', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newPost = new Post({ userId, content, timestamp: new Date() });
    await newPost.save();
    res.status(201).send('Post created!');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all posts
app.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Serve Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
