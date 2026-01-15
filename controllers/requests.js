const Request = require('../models/request');
const Food = require('../models/food');

// CREATE REQUEST (receiver)
const createRequest = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);

    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    if (food.status !== 'available') {
      return res.status(400).json({ error: 'Food not available' });
    }

    // Only receivers can request
    if (req.user.role !== 'receiver') {
      return res.status(403).json({ error: 'Only receivers can request food' });
    }

    // Prevent duplicate request
    const existingRequest = await Request.findOne({
      food: food._id,
      requester: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already sent' });
    }

    const request = await Request.create({
      food: food._id,
      requester: req.user._id,
    });

    // UPDATE FOOD STATUS
    food.status = 'requested';
    await food.save();

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE REQUEST (donor)
const approveRequest = async (req, res) => {
    try {
      const request = await Request.findById(req.params.requestId).populate('food');
  
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      // Only food owner can approve
      if (request.food.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized' });
      }
  
      request.status = 'approved';
      request.food.status = 'requested';
  
      await request.food.save();
      await request.save();
  
      res.json({ success: true, data: request });
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

  module.exports = { createRequest, approveRequest, rejectRequest, myRequests };
  
