// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Connect to MongoDB
mongoose.connect('mongodb+srv://adminuserbaddie:plsALLDAY12345%21@cluster0.o5ssovo.mongodb.net/Ivy?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Import User model
const User = require('./models/User');

// Model for posts
const Post = mongoose.model('Post', {
  userId: String,
  content: String,
  timestamp: Date
});

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, profilePic, bio, location } = req.body;
    const newUser = new User({ username, email, password, profilePic, bio, location });
    await newUser.save();
    res.status(201).json({ success: true, userId: newUser._id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found.');
    }

    if (user.password !== password) {
      return res.status(400).send('Incorrect password.');
    }

    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create a Post Route
app.post('/create-post', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newPost = new Post({
      userId,
      content,
      timestamp: new Date()
    });
    await newPost.save();
    res.status(201).send('Post created!');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get all Posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get User Profile + Posts
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

// Real-time Post Updates (Socket.io - optional for later)
io.on('connection', (socket) => {
  console.log('A user connected.');
});

// Root
app.get('/', (req, res) => {
  res.send('Welcome to Ivy Bestie!');
});

// Start Server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));