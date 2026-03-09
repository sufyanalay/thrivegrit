const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log('📋 Loaded', projects.length, 'projects');
    res.json({ success: true, projects });
  } catch (error) {
    console.error('❌ Projects fetch error:', error);
    res.json({ success: true, projects: [] });
  }
});

// POST new project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    console.log('✅ NEW PROJECT SAVED:', project.title);
    res.json({ success: true, project });
  } catch (error) {
    console.error('❌ Save error:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    console.log('✅ PROJECT UPDATED:', project.title);
    res.json({ success: true, project });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    console.log('✅ PROJECT DELETED');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
