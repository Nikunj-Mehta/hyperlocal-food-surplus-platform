// Server entry point
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // Whenever app.js is required, it will be executed completely and there is no need to run any function to call it or run it.

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-surplus_db')
  .then(() => {
    console.log('Connected to MongoDB');

    // Load models
    require('./models/user');
    require('./models/food');
    require('./models/request');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});