const express = require('express');
const router = express.Router();  // 🔥 Router defined!
const Blog = require('../models/Blog');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

module.exports = router;
