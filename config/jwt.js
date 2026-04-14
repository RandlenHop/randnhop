const jwt = require('jsonwebtoken');
const config = require('./db');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username
    },
    config.secretOrKey,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;