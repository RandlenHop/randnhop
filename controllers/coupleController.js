const Couple = require('../models/Couple');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { generateCoupleCode } = require('../utils');

const createCouple = async (req, res) => {
  const { partnerEmail, unlockDate } = req.body;
  const userId = req.user.userId;

  try {
    if (!partnerEmail || !unlockDate) {
      throw new BadRequestError('Please provide partner email and unlock date');
    }

    // Prevent self-coupling
    if (partnerEmail === req.user.email) {
      throw new BadRequestError("You can't create a couple with yourself");
    }

    // Check if the current user is already in a couple
    const currentUser = await User.findById(userId);
    if (currentUser.coupleCode) {
      throw new BadRequestError('You are already in a couple');
    }

    // Find the partner user
    // const partnerUser = await User.findOne({ email: partnerEmail });
    // if (!partnerUser) {
    //   throw new NotFoundError(`No user with email: ${partnerEmail}`);
    // }

    if (partnerUser.coupleCode) {
      throw new BadRequestError('This user is already in a couple');
    }

    // Generate a unique couple code
    const coupleCode = generateCoupleCode();

    // Create the couple
    const couple = await Couple.create({
      coupleCode,
      user1: userId,
      partnerEmail,
      unlockDate: new Date(unlockDate),
    });

    // Update both users with the couple code
    currentUser.coupleCode = coupleCode;
    await currentUser.save();

    res.status(StatusCodes.CREATED).json({
      couple,
      message: `Couple created successfully!, Share this code ${coupleCode} with your partner`,
      coupleCode,
    });
  } catch (error) {
    console.error('Error creating couple:', error.message);
    // Make sure to pass the error message to the frontend
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCoupleStatus = async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user.coupleCode) {
    return res.status(StatusCodes.OK).json({
      inCouple: false,
      message: 'No couple linked yet',
    });
  }

  const couple = await Couple.findOne({ coupleCode: user.coupleCode })
    .populate('user1', 'name email')
    .populate('user2', 'name email');

  if (!couple) {
    return res.status(StatusCodes.OK).json({
      inCouple: false,
      message: 'Couple not found',
    });
  }

  // res.status(StatusCodes.OK).json({
  //   inCouple: true,
  //   couple,
  //   message: couple.user2
  //     ? 'Couple is complete!'
  //     : 'Waiting for partner to join',
  // });

  let partnerName = null;
  let partnerEmail = couple.partnerEmail;

  if (couple.user1._id.toString() === userId) {
    // Current user is user1
    partnerName = couple.user2?.name || null;
  } else if (couple.user2 && couple.user2._id.toString() === userId) {
    // Current user is user2
    partnerName = couple.user1?.name || null;
  }

  return res.status(StatusCodes.OK).json({
    inCouple: true,
    couple,
    partnerName: partnerName || null,
    partnerEmail: partnerName ? null : partnerEmail, // Only show email if name isn't available yet
    message: couple.user2
      ? 'Couple is complete!'
      : 'Waiting for partner to join',
  });
};

const joinCouple = async (req, res, next) => {
  const { coupleCode } = req.body;
  const userId = req.user.userId;

  try {
    if (!coupleCode) {
      throw new BadRequestError('Please provide couple code');
    }

    const currentUser = await User.findById(userId);
    if (currentUser.coupleCode) {
      throw new BadRequestError('You are already in a couple');
    }

    // Find couple (case insensitive)
    const couple = await Couple.findOne({
      coupleCode: { $regex: new RegExp(`^${coupleCode}$`, 'i') },
    }).populate('user1 user2');

    if (!couple) {
      throw new NotFoundError('Invalid couple code');
    }

    // Prevent joining your own couple
    if (couple.user1.equals(userId)) {
      throw new BadRequestError(
        'You created this couple - wait for your partner to join'
      );
    }

    // Ensure couple isn't already complete
    if (couple.user2) {
      throw new BadRequestError('This couple is already complete (2/2 users)');
    }

    // Check for invalid self-joined couples
    // if (couple.user2 && couple.user1._id.equals(couple.user2._id)) {
    // Fix the invalid couple by removing user2
    //   couple.user2 = undefined;
    //   await couple.save();
    // }

    // Check if user is already part of this couple
    if (
      couple.user1._id.equals(userId) ||
      (couple.user2 && couple.user2._id.equals(userId))
    ) {
      currentUser.coupleCode = coupleCode;
      await currentUser.save();
      return res.status(StatusCodes.OK).json({
        couple,
        message: 'You are already part of this couple',
      });
    }

    // More detailed equality checks
    // console.log('Comparing users:', {
    //   'couple.user1.equals(userId)': couple.user1.equals(userId),
    //   'couple.user2 exists': !!couple.user2,
    //   'couple.user2.equals(userId)': couple.user2?.equals(userId)
    // });

    couple.user2 = userId;
    await couple.save();

    currentUser.coupleCode = coupleCode;
    await currentUser.save();
    console.log('Updated user with couple code');

    res.status(StatusCodes.OK).json({
      couple,
      message: 'Successfully joined the couple!',
      partner: await User.findById(couple.user1, 'name email'), // Show partner info
    });
  } catch (error) {
    console.error('Error in joinCouple:', error);
    next(error);
  }
};
module.exports = {
  createCouple,
  getCoupleStatus,
  joinCouple,
};
