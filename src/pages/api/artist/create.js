import jwt from 'jsonwebtoken';
import Artist from '../../../models/artist';  
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  await connectToDatabase(); // Connect to the database

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, bio, email, password } = req.body; // Destructure request body

  // Check if all fields are present
  if (!name || !bio || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if an artist with the same email already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Create a new artist document
    const newArtist = new Artist({
      name,
      bio,
      email,
      password, // Just pass the raw password, Mongoose will hash it via the pre-save hook
    });

    // Save the new artist
    await newArtist.save();

    // Generate a JWT token for the new artist
    const token = jwt.sign({ artistId: newArtist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT as an HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

    // Send a success response with the new artist data
    return res.status(200).json({
      message: 'Artist account created successfully',
      artist: newArtist,
    });
  } catch (err) {
    console.error('Error creating artist:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
