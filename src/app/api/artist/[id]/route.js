import { NextResponse } from 'next/server';
import multer from 'multer';  
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  
import { connectToDatabase } from '../../../../lib/db';
import Artist from '../../../../models/artist';
import { getToken } from 'next-auth/jwt'; 

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

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params; 

    const artist = await Artist.findById(id);
    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Error fetching artist data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    console.log("Connected to the database");

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token:", token);

    if (!token || !token.artistId) {
      console.log("Unauthorized attempt");
      return NextResponse.json({ message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = params; 
    console.log("Artist ID from URL:", id);

    return new Promise((resolve, reject) => {
      upload(req, {}, async (err) => {
        if (err) {
          console.error('Multer error:', err);
          return reject(NextResponse.json({ message: 'File upload error' }, { status: 400 }));
        }

        try {
          const { name, bio, solanaWallet } = req.body;
          const profilePicture = req.file; 

          console.log("Form Data received - name:", name, "bio:", bio, "solanaWallet:", solanaWallet);

          const artist = await Artist.findById(id);
          if (!artist) {
            console.log("Artist not found");
            return resolve(NextResponse.json({ message: 'Artist not found' }, { status: 404 }));
          }

          artist.name = name || artist.name;
          artist.bio = bio || artist.bio;
          artist.solanaWallet = solanaWallet || artist.solanaWallet;

          if (profilePicture) {
            console.log("Uploading profile picture to S3...");
            const profilePictureUrl = await uploadToS3(profilePicture);
            artist.profilePictureUrl = profilePictureUrl;
            console.log("Profile picture uploaded successfully:", profilePictureUrl);
          }

          await artist.save();

          console.log("Updated Artist:", artist);
          console.log("Artist profile updated successfully");

          const artistPlain = artist.toObject({ getters: true, versionKey: false });
          resolve(NextResponse.json({ message: 'Profile updated successfully', artist: artistPlain }, { status: 200 }));

        } catch (error) {
          console.error('Error updating artist:', error);
          reject(NextResponse.json({ message: 'Server error' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
  }
}
