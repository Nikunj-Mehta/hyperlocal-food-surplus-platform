const mongoose = require('mongoose');
const User = require('../models/user');
const Food = require('../models/food');

mongoose.connect('mongodb://127.0.0.1:27017/food-surplus_db');

async function testModels() {
  await User.deleteMany({});
  await Food.deleteMany({});

  const user = new User({
    name: 'Test Donor',
    email: 'donor@test.com',
    password: 'password123',
    role: 'donor'
  });

  await user.save();

  const food = new Food({
    title: 'Veg Biryani',
    description: 'Fresh leftover food from event',
    quantity: 20,
    quantityUnit: 'plates',
    foodType: 'edible',
    address: 'Karve Nagar, Pune',
    location: {
      coordinates: [73.8567, 18.5204]
    },
    author: user._id
  });

  await food.save();

  console.log('User and Food saved successfully');
  console.log(food);
  mongoose.connection.close();
}

testModels();