const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { 
      userId: payload.id, 
      name: payload.username, 
      role: payload.role 
    };
    
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Unauthorized to access this route' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };