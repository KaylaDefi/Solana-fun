import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import path from 'path';
import Artist from '../../../models/artist';  // Adjust the path to your models
import { connectToDatabase } from '../../../lib/db';
import { verifyToken } from '../../../lib/authMiddleware';  // Import the verifyToken helper

// Set up multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,  // Disable built-in body parser to handle file uploads manually
  },
};

// S3 Client setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  await connectToDatabase();  // Connect to MongoDB

  // Handle GET request to fetch artist data
  if (req.method === 'GET') {
    try {
      const decodedToken = verifyToken(req);  // Verify token using the helper
      console.log('Decoded Token:', decodedToken); // Log the decoded token
      console.log('Requested Artist ID:', req.query.id); // Log the artist ID being queried
      
      const artist = await Artist.findById(req.query.id);
      console.log('Found Artist:', artist); // Log the artist object if found
      
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      if (decodedToken.artistId !== artist._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      res.status(200).json({ artist });
    } catch (error) {
      console.error('Error fetching artist:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
  

  // Handle PUT request to update artist profile
  else if (req.method === 'PUT') {
    upload.single('profilePicture')(req, {}, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading profile picture' });
      }

      try {
        const decodedToken = verifyToken(req);  // Use the imported verifyToken function

        if (decodedToken.artistId !== req.query.id) {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const artist = await Artist.findById(req.query.id);
        if (!artist) {
          return res.status(404).json({ message: 'Artist not found' });
        }

        // Parsing body values from formData (sent via the client)
        const { name, bio, solanaWallet } = req.body;

        // Build update object with optional fields
        const updateData = { name, bio, solanaWallet };

        // Handle profile picture upload if provided
        if (req.file) {
          const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: Date.now().toString() + path.extname(req.file.originalname),
            Body: req.file.buffer,
          };

          const parallelUploadS3 = new Upload({
            client: s3,
            params: uploadParams,
          });

          const s3Result = await parallelUploadS3.done();
          updateData.profilePictureUrl = s3Result.Location;  // Add profile picture URL to update
        }

        // Update the artist document in MongoDB
        const updatedArtist = await Artist.findByIdAndUpdate(req.query.id, updateData, { new: true });

        res.status(200).json({
          message: 'Profile updated successfully',
          artist: updatedArtist,
        });
      } catch (error) {
        console.error('Error updating artist:', error);
        return res.status(500).json({ message: 'Server error' });
      }
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
