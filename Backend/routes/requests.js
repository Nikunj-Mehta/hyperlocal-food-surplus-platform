const express = require('express');
const { myRequests, getReceivedRequests, approveRequest, rejectRequest } = require('../controllers/requests');
const protect = require('../middleware/auth');

const router = express.Router();

// /requests
router.get('/my', protect, myRequests); // Requests I sent
router.get("/received", protect, getReceivedRequests); // Request I received
router.put('/:requestId/approve', protect, approveRequest);
router.put('/:requestId/reject', protect, rejectRequest);

module.exports = router;