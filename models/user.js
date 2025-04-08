// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/images/default-profile.jpg' }, // default profile picture
  bio: { type: String, default: '' }, // default bio empty
  location: { type: String, default: '' }, // default location empty
  friends: { type: [String], default: [] }, // future upgrade: friends system
  videos: { type: [String], default: [] } // future upgrade: video embeds
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);