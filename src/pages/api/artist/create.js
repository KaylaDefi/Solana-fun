import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Artist from '../../../models/artist';  // Adjust path based on your folder structure
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  await connectToDatabase();  // Connect to the database

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, bio, email, password } = req.body;  // No profilePicture here

  // Basic validation
  if (!name || !bio || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the email is already in use
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new artist
    const newArtist = new Artist({
      name,
      bio,
      email,
      password: hashedPassword,  // Store the hashed password
    });

    // Save the new artist to the database
    await newArtist.save();

    // Generate JWT token
    const token = jwt.sign({ artistId: newArtist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in HttpOnly cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

    // Respond with the newly created artist
    return res.status(200).json({
      message: 'Artist account created successfully',
      artist: newArtist,
    });
  } catch (err) {
    console.error('Error creating artist:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
