// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/images/default-profile.jpg' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  music: { type: String, default: '' },
  friends: { type: [String], default: [] },
  statuses: { type: [String], default: [] },
  messages: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);