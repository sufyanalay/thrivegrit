const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName:  { type: String, default: 'ThriveGrit' },
  tagline:   { type: String, default: 'Strategy-first web design for founders.' },
  email:     { type: String, default: 'hello@thrivegrit.com' },
  phone:     { type: String, default: '+923474862915' },
  whatsapp:  { type: String, default: 'https://wa.me/923474862915' },
  instagram: { type: String, default: 'https://instagram.com/sufyaan.alii' },
  twitter:   { type: String, default: 'https://twitter.com/thrivegrit' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);