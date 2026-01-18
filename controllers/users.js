const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const Food = require('../models/food');
const Request = require('../models/request');
const { cloudinary } = require('../cloudinary');

// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user  User.create() is a mongoose method that creates a new user in the database and also saves it.
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Send response with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // 3. Send response with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
  
const User = require('../models/user');
const Food = require('../models/food');
const Request = require('../models/request');
const { cloudinary } = require('../cloudinary');

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only admin or self
    if (
      req.user._id.toString() !== user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Find foods created by user
    const foods = await Food.find({ author: user._id });

    for (let food of foods) {
      // Delete images
      for (let img of food.images) {
        await cloudinary.uploader.destroy(img.filename);
      }

      // Delete related requests for the food listing uploaded by this user.
      await Request.deleteMany({ food: food._id });

      await food.deleteOne();
    }

    // Delete requests made by user
    await Request.deleteMany({ requester: user._id });

    // Delete user
    await user.deleteOne();

    res.json({ success: true, message: 'User and related data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, deleteUser };