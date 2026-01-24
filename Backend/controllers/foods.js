const Food = require('../models/food');
const { cloudinary } = require('../cloudinary');
const Request = require('../models/request');

// Get all foods
const index = async (req, res) => {
  try {
    const foods = await Food.find({ foodType: 'edible', status: { $ne: 'picked' }}).populate('author', 'name email');

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
      return res.status(404).json({
        success: false,
        error: "Food not found",
      });
    }

    // Only owner or admin
    if (
      food.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized",
      });
    }

    // -----------------------------
    // 1️⃣ Update basic fields
    // -----------------------------
    food.title = req.body.title;
    food.quantity = req.body.quantity;
    food.quantityUnit = req.body.quantityUnit;
    food.foodType = req.body.foodType;
    food.address = req.body.address;

    food.location = {
      type: "Point",
      coordinates: [
        Number(req.body.longitude),
        Number(req.body.latitude),
      ],
    };

    // -----------------------------
    // 2️⃣ Handle image sync
    // -----------------------------

    // Remaining images sent from frontend
    let remainingImages = req.body.existingImages || [];

    // Handle single value case
    if (typeof remainingImages === "string") {
      remainingImages = [remainingImages];
    }

    // Delete images removed on frontend
    const imagesToDelete = food.images.filter(
      (img) => !remainingImages.includes(img.filename)
    );

    for (let img of imagesToDelete) {
      await cloudinary.uploader.destroy(img.filename);
    }

    // Keep only remaining images
    food.images = food.images.filter((img) =>
      remainingImages.includes(img.filename)
    );

    // -----------------------------
    // 3️⃣ Add new uploaded images
    // -----------------------------
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      food.images.push(...newImages);
    }

    await food.save();

    res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);
    res.status(500).json({
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

    if (food.status !== "available") {
      return res.status(400).json({
        success: false,
        error: "Only available food listings can be deleted",
      });
    }


    // Delete images from Cloudinary
    if (food.images && food.images.length > 0) {
      for (let img of food.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }

    // Delete all requests related to this food
    await Request.deleteMany({ food: food._id });

    // Delete food from DB
    await food.deleteOne(); // Delete images → Delete requests → Delete food

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

// Get foods created by logged-in user
const myFoods = async (req, res) => {
  try {
    const foods = await Food.find({ author: req.user._id });

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

const getFoodWithRequests = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId).populate("author", "name email");

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    // Only owner can see requests on this food
    if (food.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const requests = await Request.find({ food: food._id })
      .populate("requester", "name email");

    res.json({
      success: true,
      food,
      requests,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  myFoods,
  getFoodWithRequests
};
