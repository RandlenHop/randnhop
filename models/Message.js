const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  couple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Couple',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide message content'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);