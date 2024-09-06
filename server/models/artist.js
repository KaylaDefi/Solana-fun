const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // To hash passwords

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    required: true,
  },
  solanaWallet: {
    type: String, // This will store the artist's public Solana wallet address
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the artist
artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Artist', artistSchema);
