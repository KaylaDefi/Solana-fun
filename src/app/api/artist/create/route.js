import Artist from '../../../../models/artist';
import { connectToDatabase } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('Incoming request to create artist');

  await connectToDatabase(); 
  console.log('Connected to the database');

  const { name, bio, email, password } = await req.json(); 
  console.log('Received data:', { name, bio, email, password });

  if (!name || !bio || !email || !password) {
    console.warn('Missing required fields');
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }

  try {
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      console.warn('Artist with this email already exists:', email);
      return NextResponse.json({ message: 'Email already in use.' }, { status: 400 });
    }

    const newArtist = new Artist({
      name,
      bio,
      email,
      password,
    });

    await newArtist.save();
    console.log('Artist saved to database:', newArtist);

    return NextResponse.json({
      message: 'Artist account created successfully.',
      artist: newArtist,
    }, { status: 200 });
  } catch (err) {
    console.error('Error creating artist:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
