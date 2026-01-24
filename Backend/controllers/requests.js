const Request = require('../models/request');
const Food = require('../models/food');

// CREATE REQUEST (receiver)
const createRequest = async (req, res) => {
  try {
    const { quantity, location } = req.body;

    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    if (food.status !== 'available') {
      return res.status(400).json({ error: 'Food not available' });
    }

    if (req.user.role !== 'receiver') {
      return res.status(403).json({ error: 'Only receivers can request food' });
    }

     // Prevent requesting own food
    if (food.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot request your own food listing' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    if (quantity > food.quantity) {
      return res.status(400).json({
        error: 'Requested quantity exceeds available quantity',
      });
    }

    // Validate location
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        error: "Requester location is required",
      });
    }

    const existingRequest = await Request.findOne({
      food: food._id,
      requester: req.user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent' });
    }

    const request = await Request.create({
      food: food._id,
      requester: req.user._id,
      requestedQuantity: quantity,
      requesterLocation: {
        type: "Point",
        coordinates: location.coordinates,
      },
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VIEW MY REQUESTS (receiver)
const myRequests = async (req, res) => {
    try {
      const requests = await Request.find({
        requester: req.user._id,
      }).populate('food');
  
      res.json({
        success: true,
        count: requests.length,
        data: requests,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

// View Requests made on food I own
const getReceivedRequests = async (req, res) => {
  try {
    // Only donors should access this
    if (req.user.role !== "donor") {
      return res.status(403).json({
        error: "Only donors can view received requests",
      });
    }

    const requests = await Request.find()
      .populate({
        path: "food",
        match: { author: req.user._id },
        select: "title quantity quantityUnit images location status",
      })
      .populate({
        path: "requester",
        select: "name email",
      });

    // Remove requests where food doesn't belong to this donor
    const validRequests = requests.filter((req) => req.food);

    // Group requests by food
    const grouped = {};

    for (let reqItem of validRequests) {
      const foodId = reqItem.food._id.toString();

      if (!grouped[foodId]) {
        grouped[foodId] = {
          food: reqItem.food,
          requests: [],
        };
      }

      grouped[foodId].requests.push({
        _id: reqItem._id,
        requestedQuantity: reqItem.requestedQuantity,
        status: reqItem.status,
        requester: reqItem.requester,
        requesterLocation: reqItem.requesterLocation,
        createdAt: reqItem.createdAt,
      });
    }

    res.status(200).json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


// APPROVE REQUEST (donor)
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('food');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.food.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    // Reduce food quantity
    request.food.quantity -= request.requestedQuantity;

    if (request.food.quantity < 0) {
      return res.status(400).json({ error: 'Insufficient food quantity' });
    }

    // Update food status
    if (request.food.quantity === 0) {
      request.food.status = 'picked';
    } else {
      request.food.status = 'available';
    }

    request.status = 'approved';

    await request.food.save();
    await request.save();

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
// REJECT REQUEST (donor)
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId).populate('food');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.food.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

  module.exports = { createRequest, myRequests, getReceivedRequests, approveRequest, rejectRequest };
  
