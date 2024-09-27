import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePictureUrl: { type: String, default: '' },
  solanaWallet: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash the password before saving
artistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Hash only if the password has been modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
artistSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent overwriting the model during hot reloads in development
const Artist = mongoose.models.Artist || mongoose.model('Artist', artistSchema);

export default Artist;
