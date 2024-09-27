import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  donor: { type: String, required: true },  // Donor's name or wallet address
  amount: { type: Number, required: true },  // Amount donated (in SOL or currency of choice)
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
export default Donation;
