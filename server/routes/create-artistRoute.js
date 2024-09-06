const express = require('express');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const bcrypt = require('bcrypt');
const Artist = require('../models/artist');

const router = express.Router();

// AWS S3 setup (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory before uploading to S3
});

// POST route to handle artist account creation
router.post('/create-account', upload.single('profilePicture'), async (req, res) => {
  const { name, bio, email, password } = req.body;
  const profilePicture = req.file;

  if (!name || !bio || !profilePicture || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the email already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: Date.now().toString() + path.extname(profilePicture.originalname),
      Body: profilePicture.buffer,
    };

    const parallelUploadS3 = new Upload({
      client: s3,
      params: uploadParams,
    });

    const s3Result = await parallelUploadS3.done();

    // Create a new artist account
    const newArtist = new Artist({
      name,
      bio,
      email,
      password: hashedPassword,
      profilePictureUrl: s3Result.Location, // URL to the uploaded image in S3
    });

    await newArtist.save();

    res.status(200).json({
      message: 'Artist account created successfully',
      artist: newArtist,
    });
  } catch (err) {
    console.error('Error creating artist account:', err);
    res.status(500).json({ message: 'Error creating account' });
  }
});

// GET route to fetch artist by ID
router.get('/artist/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findById(id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (err) {
    console.error('Error fetching artist:', err);
    res.status(500).json({ message: 'Error fetching artist' });
  }
});

// PUT route to update Solana wallet address
router.put('/artist/:id/wallet', async (req, res) => {
  const { id } = req.params;
  const { solanaWallet } = req.body;

  try {
    const updatedArtist = await Artist.findByIdAndUpdate(id, { solanaWallet }, { new: true });

    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json({
      message: 'Solana wallet address updated successfully',
      artist: updatedArtist,
    });
  } catch (err) {
    console.error('Error updating wallet address:', err);
    res.status(500).json({ message: 'Error updating wallet address' });
  }
});

// PUT route to update artist profile
router.put('/artist/:id/profile', async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  try {
    const updatedArtist = await Artist.findByIdAndUpdate(id, { name, bio }, { new: true });

    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      artist: updatedArtist,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
