const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },   // cents/paise unit
  history: [{ type: Object }]
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  wallet: { type: walletSchema, default: () => ({}) },
  lastAdAt: { type: Date },
  deviceInfo: { type: Object }
});

module.exports = mongoose.model('User', userSchema);
