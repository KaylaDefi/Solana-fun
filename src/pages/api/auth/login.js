import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // ... Your authentication logic here (e.g., find the user, verify password)

    const artistId = 'some-artist-id'; // Example artist ID after authentication
    const token = jwt.sign({ artistId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token as HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
    
    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
