// Main application file
const express = require('express');
const foodRoutes = require('./routes/foods');
const userRoutes = require('./routes/users');
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Middleware for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') { // Browser → OPTIONS → Server says OK → Browser → Actual request
    res.sendStatus(200);
  } else {
    next(); // if request is not OPTIONS, like GET, POST, PUT, DELETE, PATCH, etc..., then go to the next middleware or the actual route handler.
  }
});

// Basic root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Food Surplus API is running' });
});

// Food routes
app.use('/foods', foodRoutes);

// User routes
app.use('/users', userRoutes);

module.exports = app;