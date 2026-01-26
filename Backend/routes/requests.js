const express = require('express');
const { myRequests, getReceivedRequests, donorNotificationCount, receiverNotificationCount, approveRequest, rejectRequest } = require('../controllers/requests');
const protect = require('../middleware/auth');

const router = express.Router();

// /requests
router.get('/my', protect, myRequests); // Requests I sent
router.get("/received", protect, getReceivedRequests); // Request I received
router.get("/notifications/donor", protect, donorNotificationCount); // To get donor notifications
router.get("/notifications/receiver", protect, receiverNotificationCount); // To get receiver notifications
router.put('/:requestId/approve', protect, approveRequest);
router.put('/:requestId/reject', protect, rejectRequest);

module.exports = router;