import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import path from 'path';
import Artist from '../../../models/artist';  
import { connectToDatabase } from '../../../lib/db';
import { verifyToken } from '../../../lib/authMiddleware';  

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,  
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  await connectToDatabase(); 

  if (req.method === 'GET') {
    try {
      const decodedToken = verifyToken(req);  
      console.log('Decoded Token:', decodedToken); 
      console.log('Requested Artist ID:', req.query.id); 
      
      const artist = await Artist.findById(req.query.id);
      console.log('Found Artist:', artist);
      
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
  
  else if (req.method === 'PUT') {
    upload.single('profilePicture')(req, {}, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading profile picture' });
      }

      try {
        const decodedToken = verifyToken(req);  

        if (decodedToken.artistId !== req.query.id) {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        const artist = await Artist.findById(req.query.id);
        if (!artist) {
          return res.status(404).json({ message: 'Artist not found' });
        }
        const { name, bio, solanaWallet } = req.body;
        const updateData = { name, bio, solanaWallet };
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
          updateData.profilePictureUrl = s3Result.Location;  
        }

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
