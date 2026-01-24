const express = require('express');
const { index, create, show, update, destroy, myFoods, getFoodWithRequests } = require('../controllers/foods');
const protect = require('../middleware/auth');
const { createRequest } = require('../controllers/requests');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


const router = express.Router();

// /foods
router.get('/', index); // public route
router.post('/', protect, upload.array('images'), create); // protected route // allows upload multiple images

// To get foods owned by a user.
// /foods/my
router.get('/my', protect, myFoods);

// /foods/:id
router.get('/:id', show); // public route
router.put('/:id', protect, upload.array('images'), update); // protected route
router.delete('/:id', protect, destroy); // protected route

// req.user is available in create/update/delete. Anonymous users cannot create or modify food.
// /foods/:foodId/request
router.post('/:foodId/request', protect, createRequest);

// To get specific food and all the requests made on it
router.get("/:foodId/requests", protect, getFoodWithRequests);

module.exports = router;