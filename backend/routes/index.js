const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');

router.use('/auth', authRoutes);

// Test
router.get('/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'pong' });
});

module.exports = router;
