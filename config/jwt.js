const jwt = require('jsonwebtoken');
const config = require('./db');

const generateToken = (user) => {
      console.log('user in jwt==>:', user);

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    config.secretOrKey,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;