const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('/models/Admin'); // Check karein aapke folder mein 'Admin' isi path par hai

// Aapka MongoDB Connection URL
const MONGO_URI = 'mongodb://127.0.0.1:27017/thrivegrit'; 

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for admin creation...');

    // Pehle check karein ke kahin pehle se admin maujood to nahi
    const existingAdmin = await Admin.findOne({ email: 'admin@thrivegrit.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists with this email.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@thrivegrit.com',
        password: hashedPassword
      });
      console.log('✅ Admin Created Successfully!');
      console.log('Email: admin@thrivegrit.com');
      console.log('Password: admin123');
    }
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  });