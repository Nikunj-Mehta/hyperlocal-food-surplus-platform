const jwt = require('jsonwebtoken');

const getTokenExpiry = () => {
  const expiresIn = (process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d')
    .trim()
    .replace(/^['"]|['"]$/g, '');

  if (/^\d+$/.test(expiresIn)) {
    return Number(expiresIn);
  }

  if (
    expiresIn &&
    !['undefined', 'null'].includes(expiresIn.toLowerCase()) &&
    /^\d+\s*(ms|s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks|y|yr|yrs|year|years)$/i.test(expiresIn)
  ) {
    return expiresIn;
  }

  return '7d';
};

const generateToken = (id) => {
  return jwt.sign( // Creates a digitally signed token
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: getTokenExpiry(),
    }
  );
};

module.exports = generateToken;
