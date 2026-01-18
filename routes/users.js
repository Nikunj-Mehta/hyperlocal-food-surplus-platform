const express = require('express');
const { register, login, deleteUser } = require('../controllers/users');
const protect = require('../middleware/auth');

const router = express.Router();

// Register user
// /users/register
router.post('/register', register);

// /users/login
router.post('/login', login);

// Protected route
router.get('/me', protect, (req, res) => {
    res.json(req.user); // If the user is logged in, return their own profile.
});

// Protected route: Delete the user and everything related to it.
router.delete('/:id', protect, deleteUser);

module.exports = router;