// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB
mongoose.connect('mongodb+srv://adminuserbaddie:plsALLDAY12345%21@cluster0.o5ssovo.mongodb.net/Ivy?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Models
const User = require('./models/User');

// Routes
app.post('/signup', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, email, password, bio, location } = req.body;
    const profilePic = req.file ? '/uploads/' + req.file.filename : '/images/default-profile.jpg';
    const newUser = new User({ username, email, password, profilePic, bio, location });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/upload-music', upload.single('musicFile'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const musicLink = '/uploads/' + req.file.filename;
    await User.findByIdAndUpdate(userId, { music: musicLink });
    res.status(200).send('Music uploaded!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));