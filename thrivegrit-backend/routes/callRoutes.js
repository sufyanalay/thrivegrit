const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 🔥 BOOKING FORM (Frontend expects /calls/booking)
router.post('/booking', async (req, res) => {
  try {
    console.log('📞 BOOKING FORM →', req.body);
    const callRequest = new Message({ ...req.body, type: 'call' });
    await callRequest.save();
    console.log('✅ SAVED CALL REQUEST:', callRequest._id);
    res.json({ success: true, message: 'Booking saved!' });
  } catch (error) {
    console.error('❌ Booking save error:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

module.exports = router;
