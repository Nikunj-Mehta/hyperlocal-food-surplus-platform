const Food = require('../models/food');

// Get all foods
const index = async (req, res) => {
  try {
    const foods = await Food.find().populate('author', 'name email');
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
      const food = new Food(req.body); // Take everything from request.body then create a new food object.
  
      // TEMP: hardcoded test user (remove after auth)
      food.author = '6964c490e71c1def9e44aabd';
  
      await food.save(); // Save the newly created food object to the database.
  
      res.status(201).json({
        success: true,
        data: food, // Send the newly created food object to the client.
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

// Update food by id
const update = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Only fields present in req.body are updated, Fields NOT present remain unchanged.
        runValidators: true, // Run the validators on the fields that are being updated.
      }
    );

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
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete food by id
const destroy = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        error: 'Food not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
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
