// models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/default-profile.jpg' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  friends: { type: [String], default: [] },
  videos: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);