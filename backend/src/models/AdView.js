const mongoose = require('mongoose');

const adViewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  ua: String,
  adId: String,
  startedAt: Date,
  finishedAt: Date,
  durationSeconds: Number,
  verified: { type: Boolean, default: false },
  reason: String
});

module.exports = mongoose.model('AdView', adViewSchema);
