const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 🔥 CONTACT FORM (Frontend expects /messages/contact)
router.post('/contact', async (req, res) => {
  try {
    console.log('🔥 CONTACT FORM →', req.body);
    const message = new Message(req.body);
    await message.save();
    console.log('✅ SAVED TO messages:', message._id);
    res.json({ success: true, message: 'Message saved!' });
  } catch (error) {
    console.error('❌ Message save error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// 🔥 ADMIN GET ALL (Admin expects /messages)
router.get('/', async (req, res) => {
  try {
    console.log('📧 GETTING all messages');
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      messages: messages.filter(m => m.type !== 'call'), 
      callRequests: messages.filter(m => m.type === 'call')
    });
  } catch (error) {
    console.error('❌ Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
