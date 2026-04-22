const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const { surname, otherNames, phoneNumber, email, password, confirmPassword } = req.body;

  // 1. Password confirmation check
  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  // 2. Check if email or phone already exists
  // We do this manually to give a clean message, though Mongoose unique:true would also catch it
  const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingUser) {
    throw new BadRequestError('Email or Phone Number already exists');
  }

  // 3. Create user
  // Mongoose will automatically trigger the 'required' validation if fields are missing
  const user = await User.create({ 
    surname, 
    otherNames, 
    phoneNumber, 
    email, 
    password 
  });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      surname: user.surname,
      otherNames: user.otherNames,
      email: user.email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: { 
      surname: user.surname, 
      otherNames: user.otherNames, 
      email: user.email 
    },
    token,
  });
};

// Added Logout Route
const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};

module.exports = {
  register,
  login,
  logout
};