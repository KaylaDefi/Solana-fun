import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT
    return decodedToken; 
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
