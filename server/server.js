const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');
const path = require('path');
const aws = require('aws-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', 
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname)); // Rename file to avoid conflicts
    }
  })
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  const title = req.body.title;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    fileName: file.key,
    fileLocation: file.location, // URL to the uploaded file
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
