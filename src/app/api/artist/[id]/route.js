import { getServerSession } from 'next-auth';  
import { NextResponse } from 'next/server';
import multer from 'multer';  
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  
import path from 'path';
import { connectToDatabase } from '../../../../lib/db';
import Artist from '../../../../models/artist';
import { authOptions } from '../../auth/[...nextauth]/authOptions';  

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3Client = new S3Client({
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(file) {
  const fileName = `${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,  
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,  
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw new Error('File upload failed');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req) {
  await connectToDatabase(); 

  const session = await getServerSession({ req }, authOptions);
  
  if (!session || !session.artistId) {
    return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { id } = req.params;

  return new Promise((resolve, reject) => {
    upload.single('profilePicture')(req, {}, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return reject(NextResponse.json({ message: 'File upload error' }, { status: 400 }));
      }

      try {
        const { name, bio, solanaWallet } = req.body;
        const artist = await Artist.findById(id);
        if (!artist) {
          return resolve(NextResponse.json({ message: 'Artist not found' }, { status: 404 }));
        }

        artist.name = name || artist.name;
        artist.bio = bio || artist.bio;
        artist.solanaWallet = solanaWallet || artist.solanaWallet;

        if (req.file) {
          const profilePictureUrl = await uploadToS3(req.file);  // Upload to S3 and get URL
          artist.profilePictureUrl = profilePictureUrl;  // Save the S3 URL to the artist's profile
        }

        await artist.save();
        resolve(NextResponse.json({ message: 'Profile updated successfully', artist }, { status: 200 }));
      } catch (error) {
        console.error('Error updating artist:', error);
        reject(NextResponse.json({ message: 'Server error' }, { status: 500 }));
      }
    });
  });
}
