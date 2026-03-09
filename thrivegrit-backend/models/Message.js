const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  phone:         String,
  company:       String,
  budget:        String,
  projectType:   String,
  message:       { type: String, required: true },
  preferredDate: String,
  preferredTime: String,
  type:          { type: String, default: 'contact', enum: ['contact', 'call'] }
}, { 
  timestamps: true  // ✅ auto createdAt + updatedAt
});

module.exports = mongoose.model('Message', messageSchema);