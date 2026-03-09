const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB ──────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thrivegrit')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ─── Models ───────────────────────────────────────────────
const Message = require('./models/Message');
const Project = require('./models/Project');
const Blog    = require('./models/Blog');

// ─── Auth Middleware ──────────────────────────────────────
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ═══════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════

// ─── Admin Login ──────────────────────────────────────────
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (
    email    !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('🔐 Admin logged in');
  res.json({ success: true, token });
});

// ─── Contact Form ─────────────────────────────────────────
app.post('/api/messages/contact', async (req, res) => {
  try {
    const message = new Message({ ...req.body, type: 'contact' });
    await message.save();
    console.log('✅ Contact message saved');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Contact save error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// ─── Book A Call ──────────────────────────────────────────
app.post('/api/calls/booking', async (req, res) => {
  try {
    const booking = new Message({ ...req.body, type: 'call' });
    await booking.save();
    console.log('✅ Call booking saved');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Booking save error:', err);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// ─── Public: Get Projects ─────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ─── Public: Get Blogs ────────────────────────────────────
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// ═══════════════════════════════════════════════════════════
//  PROTECTED ADMIN ROUTES (token required)
// ═══════════════════════════════════════════════════════════

// ─── Messages ─────────────────────────────────────────────
app.get('/api/admin/messages', protect, async (req, res) => {
  try {
    const all = await Message.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      messages:     all.filter(m => m.type !== 'call'),
      callRequests: all.filter(m => m.type === 'call')
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.delete('/api/admin/messages/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ─── Projects CRUD ────────────────────────────────────────
app.post('/api/projects', protect, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    console.log('✅ Project saved:', project.title);
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/projects/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── Blogs CRUD ───────────────────────────────────────────
app.post('/api/blogs', protect, async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    console.log('✅ Blog saved:', blog.title);
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save blog' });
  }
});

app.put('/api/blogs/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/api/blogs/:id', protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ─── Dashboard Stats ──────────────────────────────────────
app.get('/api/admin/stats', protect, async (req, res) => {
  try {
    const [messages, callRequests, projects, blogs] = await Promise.all([
      Message.countDocuments({ type: 'contact' }),
      Message.countDocuments({ type: 'call' }),
      Project.countDocuments(),
      Blog.countDocuments()
    ]);
    res.json({ success: true, messages, callRequests, projects, blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
// ─── Change Password (Protected) ─────────────────────────
app.put('/api/admin/change-password', protect, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  // ✅ .env update nahi hoga runtime mein — sirf session ke liye
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});
// ─── Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));