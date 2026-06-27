require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-surplus_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Load model
    const Food = require('./models/food');
    
    const result = await Food.updateMany({ status: 'picked' }, { $set: { status: 'fulfilled' } });
    console.log(`Updated ${result.modifiedCount} food items from 'picked' to 'fulfilled'`);
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
