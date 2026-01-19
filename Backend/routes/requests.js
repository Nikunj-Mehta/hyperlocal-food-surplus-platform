const express = require('express');
const { approveRequest, rejectRequest, myRequests } = require('../controllers/requests');
const protect = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, myRequests);
router.put('/:requestId/approve', protect, approveRequest);
router.put('/:requestId/reject', protect, rejectRequest);

module.exports = router;