import { NextResponse } from 'next/server';
import multer from 'multer';  
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  
import { connectToDatabase } from '../../../../../lib/db';
import Artist from '../../../../../models/artist';
import { getToken } from 'next-auth/jwt';

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('profilePicture');

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

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser since multer will handle it
  },
};

export async function POST(req, { params }) {
  try {
    await connectToDatabase();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.artistId !== params.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return new Promise((resolve, reject) => {
      upload(req, {}, async (err) => {
        if (err) {
          return reject(NextResponse.json({ message: 'File upload error' }, { status: 400 }));
        }

        const profilePicture = req.file;
        if (!profilePicture) {
          return reject(NextResponse.json({ message: 'No file uploaded' }, { status: 400 }));
        }

        const artist = await Artist.findById(params.id);
        if (!artist) {
          return resolve(NextResponse.json({ message: 'Artist not found' }, { status: 404 }));
        }

        const profilePictureUrl = await uploadToS3(profilePicture);
        artist.profilePictureUrl = profilePictureUrl;

        await artist.save();

        return resolve(NextResponse.json({ message: 'Profile picture updated', profilePictureUrl }));
      });
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
