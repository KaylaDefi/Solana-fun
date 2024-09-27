import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/db'; 
import Artist from '../../../models/artist'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    await connectToDatabase(); 
    const artist = await Artist.findOne({ email });
    if (!artist) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    // Log the incoming plain password and stored hashed password
    console.log('Incoming password:', password);
    console.log('Stored hashed password:', artist.password);

    const passwordMatch = await bcrypt.compare(password, artist.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { artistId: artist._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);

    return res.status(200).json({ message: 'Login successful', artistId: artist._id });
  } 
  catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
