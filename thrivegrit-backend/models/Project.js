const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    category: { type: String, default: 'Web Dev', enum: ['Web Dev', 'UI/UX', 'SEO', 'Brand', 'YouTube', 'Marketing'] },
    tag: { type: String, default: 'New', trim: true, maxlength: 50 },
    link: { type: String, trim: true },
    read_time: { type: Number, default: 5, min: 1, max: 60 },
    icon: { type: String, default: '🚀', maxlength: 10 },
    image: String,
    featured: { type: Boolean, default: false }
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { delete ret.__v; return ret; } },
    toObject: { virtuals: true }
});

// 🔥 Index for FAST queries
projectSchema.index({ category: 1, featured: -1 });
projectSchema.index({ title: 'text', excerpt: 'text' });

module.exports = mongoose.model('Project', projectSchema);
