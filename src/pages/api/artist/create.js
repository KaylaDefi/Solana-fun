import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Artist from '../../../models/artist';  
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  await connectToDatabase(); 

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, bio, email, password } = req.body; 

  if (!name || !bio || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newArtist = new Artist({
      name,
      bio,
      email,
      password: hashedPassword, 
    });

    await newArtist.save();

    const token = jwt.sign({ artistId: newArtist._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

    return res.status(200).json({
      message: 'Artist account created successfully',
      artist: newArtist,
    });
  } catch (err) {
    console.error('Error creating artist:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
