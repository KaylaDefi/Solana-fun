const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const artistRoutes = require('./routes/create-artistRoute');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api', artistRoutes);
app.use('/api', authRoutes);
// Simple root route
app.get('/', (req, res) => {
  res.send('Welcome to the Express API!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
