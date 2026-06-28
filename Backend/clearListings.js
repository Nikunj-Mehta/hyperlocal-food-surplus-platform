require('dotenv').config();
const mongoose = require('mongoose');

// Load models
const Food = require('./models/food');
const Request = require('./models/request');
const Review = require('./models/review');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-surplus_db')
  .then(async () => {
    console.log('Connected to MongoDB for clearing listings.');

    try {
      const foodResult = await Food.deleteMany({});
      console.log(`Deleted ${foodResult.deletedCount} foods.`);

      const requestResult = await Request.deleteMany({});
      console.log(`Deleted ${requestResult.deletedCount} requests.`);

      const reviewResult = await Review.deleteMany({});
      console.log(`Deleted ${reviewResult.deletedCount} reviews.`);

      console.log('Successfully cleared all listings while retaining profiles.');
      process.exit(0);
    } catch (err) {
      console.error('Error clearing listings:', err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
