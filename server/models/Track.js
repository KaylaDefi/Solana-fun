const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  }, // S3 URL where the file is stored
  fileName: {
    type: String,
    required: true,
  }, // S3 key or name of the file
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
