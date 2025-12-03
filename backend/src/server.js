require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connect } = require('./config/db');

const authRoutes = require('./routes/auth');
const adsRoutes = require('./routes/ads');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// basic global rate limit
app.use(rateLimit({ windowMs: 1000 * 60, max: 200 }));

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);

const port = process.env.PORT || 4000;

(async () => {
  await connect(process.env.MONGO_URI || 'mongodb://localhost:27017/adearn');
  app.listen(port, () => console.log('Server running on', port));
})();
