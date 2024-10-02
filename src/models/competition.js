import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  votes: { type: Number, default: 0 },  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Competition = mongoose.models.Competition || mongoose.model('Competition', competitionSchema);
export default Competition;
