import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/db';
import Artist from '../../../../models/artist';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: true, 
  },
};

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params; 

    const artist = await Artist.findById(id);
    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.artistId !== params.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const artist = await Artist.findById(id);
    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    const { name, bio, solanaWallet } = await req.json(); 
    console.log("Form Data received - name:", name, "bio:", bio, "solanaWallet:", solanaWallet);

    artist.name = name || artist.name;
    artist.bio = bio || artist.bio;
    artist.solanaWallet = solanaWallet || artist.solanaWallet;

    await artist.save();

    return NextResponse.json({ message: 'Profile updated successfully', artist }, { status: 200 });
  } catch (error) {
    console.error('Error updating artist:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
