import { verifyToken } from '../../../lib/authMiddleware';
import Artist from '../../../models/artist';
import Competition from '../../../models/competition';
import Donation from '../../../models/donation'; 
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const decodedToken = verifyToken(req); 
    const artistId = decodedToken.artistId;

    const artist = await Artist.findById(artistId);
    const competitions = await Competition.find({ artistId }); 
    const donations = await Donation.aggregate([
      { $match: { artistId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, recent: { $push: '$$ROOT' } } },
      { $project: { totalAmount: 1, recent: { $slice: ['$recent', 5] } } },
    ]);

    return res.status(200).json({
      artistData: artist,
      competitions,
      donations: donations.length > 0 ? donations[0] : { totalAmount: 0, recent: [] },
    });
  } catch (error) {
    console.error('Error fetching artist dashboard data:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
