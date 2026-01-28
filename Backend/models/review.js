const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
    unique: true // one review per request
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);