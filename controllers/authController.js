const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError,NotFoundError } = require('../errors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');



const sendEmail = async (options) => {
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // 👈 Force IPv4
});

  const mailOptions = {
    from: `randles and hopkick<${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};


const register = async (req, res) => {
const { surname, otherNames, phoneNumber, email, password, confirmPassword ,photoUrl} = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }
  
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

  if (adminPassword !== process.env.ADMIN_GATE_PASSWORD) {
    throw new UnauthenticatedError('Invalid Admin Gate Password');
  }
  const adminUser = await User.findOne({ role: 'admin'}
  );

  if (!adminUser) {
    throw new UnauthenticatedError('No administrator account found in database');
  }

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError('Please provide a valid email');

  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError('There is no user with that email address');

  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2.(expires in 10 mins)
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(StatusCodes.OK).json({ msg: 'Token sent to email!' });
  } catch (err) {
    console.error("NODEMAILER ERROR LOG ERROR DETECTED ==>", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('There was an error sending the email. Try again later');
  }
};

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  
  // 1. Get user based on the hashed token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new BadRequestError('Token is invalid or has expired');

  // 2. Check if passwords match and update
  if (password !== confirmPassword) throw new BadRequestError('Passwords do not match');
  
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();

  // 3. Log the user in, send JWT
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ msg: 'Password reset successful', token });
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

const logout = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'User logged out' });
};

module.exports = {
  register,
  login,
  adminGateLogin,
  forgotPassword,
  resetPassword,
  logout,
  getAllUsers
};