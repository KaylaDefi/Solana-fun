import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  
import { connectToDatabase } from '../../../../../lib/db';
import Artist from '../../../../../models/artist';
import { getToken } from 'next-auth/jwt';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function uploadToS3(file) {
  const fileName = `${Date.now()}-${file.name}`;

  const fileBuffer = await streamToBuffer(file.stream());

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer, 
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log("Upload to S3 successful:", fileName);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error('File upload failed');
  }
}

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(req) {
  try {
    await connectToDatabase();
    console.log("Connected to the database.");

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token from request:", token);

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Token missing' }, { status: 401 });
    }

    const tokenArtistId = token.artistId;
    console.log("Artist ID from token:", tokenArtistId);

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ message: 'Unsupported content type' }, { status: 400 });
    }

    const formData = await req.formData();
    const profilePicture = formData.get('profilePicture');
    const artistId = formData.get('artistId');

    console.log("Artist ID from form:", artistId);
    console.log("Profile picture:", profilePicture);

    if (!artistId) {
      return NextResponse.json({ message: 'Artist ID missing in form data' }, { status: 400 });
    }

    if (tokenArtistId !== artistId) {
      return NextResponse.json({ message: 'Unauthorized: Artist ID mismatch' }, { status: 401 });
    }

    if (!profilePicture) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const profilePictureUrl = await uploadToS3(profilePicture);
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return NextResponse.json({ message: 'Artist not found' }, { status: 404 });
    }

    artist.profilePictureUrl = profilePictureUrl;
    await artist.save();

    return NextResponse.json({ message: 'Profile picture updated successfully', profilePictureUrl });
  } catch (error) {
    console.error("Error in pfp-route:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
