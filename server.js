// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://adminuserbaddie:plsALLDAY12345%21@cluster0.o5ssovo.mongodb.net/Ivy?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Load User and Post models
const User = require('./models/user'); // Make sure you have the updated User.js!
const Post = mongoose.model('Post', {
  userId: String,
  content: String,
  timestamp: Date
});

// ROUTES
// ✧ SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, location, bio, profilePicInput } = req.body;
    const newUser = new User({ username, email, password, location, bio, profilePicInput, friends: [], videos: [] });
    await newUser.save();
    res.json({ success: true, userId: newUser._id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✧ LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid login' });
    }
    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✧ CREATE POST
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

// ✧ GET POSTS
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ✧ USER PROFILE
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

// ✧ UPLOAD VIDEO
app.post('/upload-video', async (req, res) => {
  try {
    const { userId, videoUrl } = req.body;
    const user = await User.findById(userId);
    if (user) {
      user.videos.push(videoUrl);
      await user.save();
      res.send('Video link saved!');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// SOCKET.IO real-time (optional)
io.on('connection', (socket) => {
  console.log('A user connected.');
});

app.get('/', (req, res) => {
  res.send('Welcome to Ivy ✧');
});

// PORT
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
