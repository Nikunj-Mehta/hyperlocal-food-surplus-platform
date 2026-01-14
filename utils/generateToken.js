const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign( // Creates a digitally signed token
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

module.exports = generateToken;