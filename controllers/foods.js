const Food = require('../models/food');
const { cloudinary } = require('../cloudinary');

// Get all foods
const index = async (req, res) => {
  try {
    const foods = await Food.find( {status: { $ne: 'picked' }} ).populate('author', 'name email');
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single food by id
const show = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('author', 'name email');
    
    if (!food) {
      return res.status(404).json({
        success: false,
        error: 'Food not found',
      });
    }

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new food
const create = async (req, res) => {
  try {
    // Parse location from form-data
    if (typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }

    const food = new Food(req.body);

    // Assign logged-in user as author
    food.author = req.user._id;

    // Save images of food listing if uploaded
    if (req.files && req.files.length > 0) {
      food.images = req.files.map(file => ({
        url: file.path,
        filename: file.filename,
      }));
    }    

    await food.save();

    res.status(201).json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update food by id
const update = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Ownership check
    if (food.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(food, req.body);
    await food.save();

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete food by id
const destroy = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        error: 'Food not found',
      });
    }

    // Owner or admin can delete
    if (food.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    // Delete images from Cloudinary
    if (food.images && food.images.length > 0) {
      for (let img of food.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }

    // Delete food from DB
    await food.deleteOne();

    res.json({
      success: true,
      message: "Food and images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
