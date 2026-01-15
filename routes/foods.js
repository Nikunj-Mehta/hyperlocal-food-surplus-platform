const express = require('express');
const { index, create, show, update, destroy } = require('../controllers/foods');
const protect = require('../middleware/auth');
const { createRequest } = require('../controllers/requests');

const router = express.Router();

// /foods
router.get('/', index); // public route
router.post('/', protect, create); // protected route

// /foods/:id
router.get('/:id', show); // public route
router.put('/:id', protect, update); // protected route
router.delete('/:id', protect, destroy); // protected route

// req.user is available in create/update/delete. Anonymous users cannot create or modify food.
// /foods/:foodId/request
router.post('/:foodId/request', protect, createRequest);

module.exports = router;