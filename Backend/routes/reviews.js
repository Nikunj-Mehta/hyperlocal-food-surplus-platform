const express = require("express");
const { createReview, getReviewsForDonor } = require("../controllers/review");
const protect = require("../middleware/auth");

const router = express.Router();

// Create review (receiver only, after approval)
// /reviews/
router.post("/", protect, createReview);

// Get reviews for a donor
router.get("/donor/:userId", getReviewsForDonor);

module.exports = router;