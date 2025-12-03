const express = require('express');
const AdView = require('../models/AdView');
const User = require('../models/User');
const antiFraud = require('../middleware/antiFraud');
const auth = require('../middleware/auth');
const router = express.Router();

// request an ad payload (client would call to get an ad id + creative URL)
router.get('/get', auth, async (req, res) => {
  // In production choose creative from inventory. Here, provide a stub adId + video URL
  const ad = {
    adId: 'sample-ad-1',
    creativeUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    requiredSeconds: parseInt(process.env.AD_MIN_WATCH_SECONDS || '10')
  };
  res.json(ad);
});

// report start (optional)
router.post('/start', auth, async (req, res) => {
  const { adId } = req.body;
  const v = await AdView.create({
    user: req.user._id,
    ip: req.ip,
    ua: req.get('user-agent'),
    adId,
    startedAt: new Date()
  });
  res.json({ viewId: v._id });
});

// report finish and verify
router.post('/finish', auth, async (req, res) => {
  const { viewId, durationSeconds, adId } = req.body;
  const ua = req.get('user-agent') || '';
  const ip = req.ip;
  const check = await antiFraud.basicCheck({ ip, ua, adId, duration: durationSeconds });
  const view = await AdView.findById(viewId);
  if (!view) return res.status(400).json({ message: 'No view' });
  view.finishedAt = new Date();
  view.durationSeconds = durationSeconds;
  view.ua = ua;
  view.ip = ip;
  if (!check.ok) {
    view.verified = false;
    view.reason = check.reason;
    await view.save();
    return res.status(400).json({ message: 'Verification failed', reason: check.reason });
  }
  // mark verified
  view.verified = true;
  view.reason = 'OK';
  await view.save();

  // credit user wallet: simple rule 1 point per required second / scale as needed
  const rewardPaise = Math.round(durationSeconds * 1); // e.g. 1 paise per second -> adjust
  req.user.wallet.balance = (req.user.wallet.balance || 0) + rewardPaise;
  req.user.wallet.history.push({
    type: 'ad_reward',
    amount: rewardPaise,
    at: new Date(),
    meta: { adId, viewId }
  });
  req.user.lastAdAt = new Date();
  await req.user.save();

  res.json({ credited: rewardPaise, balance: req.user.wallet.balance });
});

router.get('/wallet', auth, async (req, res) => {
  const u = await User.findById(req.user._id);
  res.json({ wallet: u.wallet });
});

module.exports = router;
