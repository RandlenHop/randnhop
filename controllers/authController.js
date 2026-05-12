const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const { surname, otherNames, phoneNumber, email, password, confirmPassword ,photoUrl} = req.body;

  // 1. Password confirmation check
  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  // 2. Check if email or phone already exists

  // const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  // if (existingUser) {
  //   throw new BadRequestError('Email or Phone Number already exists');
  // }

  
  // 3. Create user
  const user = await User.create({ 
    surname, 
    otherNames, 
    phoneNumber, 
    email, 
    password,
    photoUrl
  });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      surname: user.surname,
      otherNames: user.otherNames,
      email: user.email,
      photoUrl: user.photoUrl, 
      phoneNumber:user.phoneNumber,
      role:user.role

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
      email: user.email,
      phoneNumber:user.phoneNumber,
      photoUrl: user.photoUrl, 
      role:user.role
    },
    token,
  });
};


const adminGateLogin = async (req, res) => {
  const { adminPassword } = req.body;

  if (!adminPassword) {
    throw new BadRequestError('Please provide the admin gate password');
  }

  // 1. Validate against the secret key in your .env file
  if (adminPassword !== process.env.ADMIN_GATE_PASSWORD) {
    throw new UnauthenticatedError('Invalid Admin Gate Password');
  }

  // 2. Fetch the actual Admin user from the database
  const adminUser = await User.findOne({ role: 'admin' });

  if (!adminUser) {
    throw new UnauthenticatedError('No administrator account found in database');
  }

  // 3. Generate a real token for the admin dashboard session
  const token = adminUser.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    user: { 
      surname: adminUser.surname, 
      role: adminUser.role 
    },
    token,
  });
};

// getAllUsers Route
const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .select('surname otherNames email phoneNumber photoUrl createdAt')
    .sort('-createdAt');

  res.status(StatusCodes.OK).json({
    success: true,
    count: users.length,
    users
  });
};

//Logout Route
const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};

module.exports = {
  register,
  login,
  adminGateLogin,
  logout,
  getAllUsers
};