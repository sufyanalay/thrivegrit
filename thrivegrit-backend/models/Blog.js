const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true },           // Blog body
    image: { type: String, default: '' },
    category: { 
        type: String, 
        default: 'Web Dev',
        enum: ['Web Dev', 'UI/UX', 'SEO', 'Brand', 'YouTube', 'Marketing']
    },
    tags: [{ type: String, trim: true, maxlength: 50 }],  // Array of tags
    read_time: { type: Number, default: 5, min: 1, max: 60 },
    icon: { type: String, default: '🚀', maxlength: 10 },
    featured: { type: Boolean, default: false }
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform: (doc, ret) => { delete ret.__v; return ret; } },
    toObject: { virtuals: true }
});

// 🔥 Fast search indexes
blogSchema.index({ category: 1, featured: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
