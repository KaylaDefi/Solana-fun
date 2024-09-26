import jwt from 'jsonwebtoken';

// Middleware-like helper function for JWT verification
export function verifyToken(req) {
  // Check for token in both cookies and Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT
    return decodedToken; // Return decoded token
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
