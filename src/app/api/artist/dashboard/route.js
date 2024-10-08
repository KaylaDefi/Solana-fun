import { getServerSession } from 'next-auth';
import Artist from '../../../../models/artist';
import Competition from '../../../../models/competition';
import Donation from '../../../../models/donation';
import { connectToDatabase } from '../../../../lib/db';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session || !session.artistId) {
      return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const artistId = session.artistId;

    const artist = await Artist.findById(artistId).select('name bio solanaWallet profilePictureUrl');

    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    const competitions = await Competition.find({ artistId });
    const donations = await Donation.aggregate([
      { $match: { artistId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' }, recent: { $push: '$$ROOT' } } },
      { $project: { totalAmount: 1, recent: { $slice: ['$recent', 5] } } },
    ]);

    return NextResponse.json({
      artistData: artist,
      competitions,
      donations: donations.length > 0 ? donations[0] : { totalAmount: 0, recent: [] },
    });
  } catch (error) {
    console.error('Error fetching artist dashboard data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
