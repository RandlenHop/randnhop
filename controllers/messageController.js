const Message = require('../models/Message');
const Couple = require('../models/Couple');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;

  if (!content) {
    throw new BadRequestError('Please provide message content');
  }

  const user = await User.findById(userId);
  if (!user.coupleCode) {
    throw new BadRequestError('You are not in a couple');
  }

  const couple = await Couple.findOne({ coupleCode: user.coupleCode });
  if (!couple) {
    throw new NotFoundError('Couple not found');
  }

  const message = await Message.create({
    couple: couple._id,
    sender: userId,
    content,
  });

  res.status(StatusCodes.CREATED).json({ message });
};

const getMessages = async (req, res) => {
  const userId = req.user.userId;
  const countOnly = req.query.countOnly === 'true';

  const user = await User.findById(userId);

  if (!user.coupleCode) {
    return res.status(StatusCodes.OK).json({
      messages: [],
      message: 'You are not in a couple yet, but you can still use your notepad.'
    });
  }

  const couple = await Couple.findOne({ coupleCode: user.coupleCode });
  if (!couple) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Couple not found' });
  }

  // Return only count if requested
  if (countOnly) {
    const count = await Message.countDocuments({ couple: couple._id });
    return res.status(StatusCodes.OK).json({ count });
  }

  // Check if the unlock date has passed
  const currentDate = new Date();
  if (currentDate < couple.unlockDate) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: 'Messages are still locked' });
  }

  // Fetch full messages
  const messages = await Message.find({ couple: couple._id })
    .populate('sender', 'name')
    .sort('createdAt');

  return res.status(StatusCodes.OK).json({ messages, count: messages.length });
};


module.exports = {
  createMessage,
  getMessages,
};
