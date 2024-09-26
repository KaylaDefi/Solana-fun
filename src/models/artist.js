import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    default: '',
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

// Helper method to compare hashed passwords
artistSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent Overwriting the existing model
const Artist = mongoose.models.Artist || mongoose.model('Artist', artistSchema);

export default Artist;
