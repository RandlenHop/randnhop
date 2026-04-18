const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const { surname, otherNames, phoneNumber, email, password, confirmPassword } = req.body;

  // 1. Check for missing fields
  if (!surname || !otherNames || !phoneNumber || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide all required fields' });
  }

  // 2. Check if passwords match
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Passwords do not match' });
  }

  try {
    // 3. Check if email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Email or Phone Number already exists' });
    }

    // 4. Create new user (surname, otherNames, etc.)
    const user = await User.create({ 
      surname, 
      otherNames, 
      phoneNumber, 
      email, 
      password 
    });

    // 5. Generate JWT token (using your existing method)
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        surname: user.surname,
        otherNames: user.otherNames,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Registration failed. Try again.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' });
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      user: { surname: user.surname, otherNames: user.otherNames, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Server error.' });
  }
};

module.exports = {
  register,
  login,
};