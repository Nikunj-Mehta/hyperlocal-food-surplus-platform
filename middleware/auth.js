const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')  // Checks:Header exists and Token format is correct. Expected format: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  ) {
    try {
      // 2. Extract token
      token = req.headers.authorization.split(' ')[1]; // Splits Bearer and token and stores token only.

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password'); // For THIS request only, remember which user is making it. This is the output we are returning to the user.

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized, token invalid',
      });
    }
  }

  // 5. No token found
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token',
    });
  }
};

module.exports = protect;
