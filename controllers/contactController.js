const Contact = require('../models/Contact');
const { StatusCodes } = require('http-status-codes');

const submitContactForm = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(StatusCodes.CREATED).json({ 
    success: true, 
    msg: 'Message sent successfully! We will get back to you soon.' 
  });
};

// Admin can see all messages
const getAllMessages = async (req, res) => {
  const messages = await Contact.find({}).sort('-createdAt');
  res.status(StatusCodes.OK).json({ success: true, count: messages.length, messages });
};

module.exports = { submitContactForm, getAllMessages };