const express = require('express');
const router = express.Router();

// 🔥 FAKE ADMIN LOGIN (No database needed)
router.post('/login', (req, res) => {
  console.log('🔐 Admin login:', req.body.email);
  const token = 'admin-jwt-token-12345';
  localStorage.setItem('adminToken', token); // Frontend ke liye
  res.json({ success: true, token });
});

// 🔥 FAKE SETTINGS (No database)
router.get('/settings', (req, res) => {
  res.json({ 
    success: true, 
    siteTitle: 'ThriveGrit', 
    adminEmail: 'admin@thrivegrit.com' 
  });
});

module.exports = router;
