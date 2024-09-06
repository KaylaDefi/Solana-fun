const express = require('express');
const bcrypt = require('bcrypt');
const Artist = require('../models/artist');

const router = express.Router();

// POST route for logging in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the artist by email
    const artist = await Artist.findOne({ email });
    if (!artist) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, artist.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Optional: Create a session or JWT token here if needed for further authentication

    res.status(200).json({
      message: 'Login successful',
      artistId: artist._id, // Send artist ID for redirect to profile page
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login' });
  }
});

module.exports = router;
