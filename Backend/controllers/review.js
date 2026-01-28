const Review = require("../models/review");
const User = require("../models/user");
const Request = require("../models/request");

const createReview = async (req, res) => {
  try {
    const { requestId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const request = await Request.findById(requestId).populate("food");
    

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (request.status !== "approved") {
      return res
        .status(400)
        .json({ error: "Request must be approved to review" });
    }

    if (request.reviewed === true) {
      return res.status(400).json({ error: "Already reviewed" });
    }


    const review = await Review.create({
      donor: request.food.author,
      receiver: req.user._id,
      request: requestId,
      rating,
    });

    // To link request with review
    request.reviewed = true;
    request.review = review._id;
    await request.save();

    //  Update donor rating aggregation
    const donor = await User.findById(request.food.author);
    const reviews = await Review.find({ donor: donor._id });

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);

    donor.rating = {
      count: reviews.length,
      average: Number((total / reviews.length).toFixed(2)),
    };

    await donor.save();

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviewsForDonor = async (req, res) => {
  try {
    const reviews = await Review.find({
      donor: req.params.userId,
    }).populate("receiver", "name");

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReview, getReviewsForDonor };