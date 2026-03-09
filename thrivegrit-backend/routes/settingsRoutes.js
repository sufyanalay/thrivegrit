const express = require('express');
const router = express.Router();  // 🔥 Router defined!

router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    settings: { 
      siteTitle: 'ThriveGrit', 
      heroText: 'We build digital experiences' 
    } 
  });
});

module.exports = router;
