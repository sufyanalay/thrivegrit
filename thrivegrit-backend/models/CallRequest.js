// backend/routes/messageRoutes.js - 2 COLLECTIONS SUPPORT
const express = require('express');
const router = express.Router();
const Messages = require('../models/Messages');
const CallRequests = require('../models/CallRequests');

// 🔥 CONTACT FORM → messages collection
router.post('/contact', async (req, res) => {
  try {
    console.log('🔥 CONTACT FORM → messages collection:', req.body);
    
    const message = new Messages({
      name: req.body.name,
      email: req.body.email,
      company: req.body.company || '',
      budget: req.body.budget || '',
      projectType: req.body.projectType || '',
      message: req.body.message
    });

    await message.save();
    console.log('✅ SAVED TO messages collection:', message._id);
    res.json({ success: true, message: 'Saved to messages collection!' });
  } catch (err) {
    console.error('❌ MESSAGES ERROR:', err);
    res.status(400).json({ error: err.message });
  }
});

// 🔥 BOOKING FORM → callrequests collection
router.post('/booking', async (req, res) => {
  try {
    console.log('🔥 BOOKING FORM → callrequests collection:', req.body);
    
    const callRequest = new CallRequests({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      message: req.body.message || ''
    });

    await callRequest.save();
    console.log('✅ SAVED TO callrequests collection:', callRequest._id);
    res.json({ success: true, message: 'Saved to callrequests collection!' });
  } catch (err) {
    console.error('❌ CALLREQUESTS ERROR:', err);
    res.status(400).json({ error: err.message });
  }
});

// 🔥 ADMIN: GET ALL DATA (BOTH COLLECTIONS)
router.get('/', async (req, res) => {
  try {
    const messages = await Messages.find().sort({ createdAt: -1 }).limit(50);
    const callRequests = await CallRequests.find().sort({ createdAt: -1 }).limit(50);
    
    res.json({ 
      success: true, 
      messages, 
      callRequests,
      totalMessages: messages.length,
      totalCallRequests: callRequests.length,
      total: messages.length + callRequests.length 
    });
  } catch (err) {
    console.error('❌ GET MESSAGES ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
