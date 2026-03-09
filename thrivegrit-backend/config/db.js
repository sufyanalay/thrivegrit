const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // 🔥 Production-grade options
      maxPoolSize: 10,                    // Connection pool
      serverSelectionTimeoutMS: 5000,     // Fast fail
      socketTimeoutMS: 45000,             // Socket timeout
      bufferMaxEntries: 0,                // No buffering
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Status: ${conn.connection.readyState === 1 ? 'Ready' : 'Connecting'}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// 🔥 Graceful reconnection
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 MongoDB error:', err.message);
});

module.exports = connectDB;
