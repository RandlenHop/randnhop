const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const CoupleSchema = new mongoose.Schema({
  coupleCode: {
    type: String,
    required: [true, 'Please provide couple code'],
    unique: true,
  },
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
   partnerEmail: String,
  unlockDate: {
    type: Date,
    required: [true, 'Please provide unlock date'],
    validate: {
      validator: function(date) {
        return date > new Date(); // Ensure unlock date is in future
      },
      message: 'Unlock date must be in the future'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add these indexes below your schema definition but before the plugin
CoupleSchema.index({ user1: 1 }, { unique: true }); // A user can only be user1 in one couple
CoupleSchema.index({ user2: 1 }, { unique: true }); // A user can only be user2 in one couple
CoupleSchema.index({ user1: 1, user2: 1 }, { unique: true ,sparse: true}); // Prevent duplicate pairs


CoupleSchema.pre('save', async function(next) {
  if (this.user2 && this.user1.equals(this.user2)) {
    throw new Error('Cannot create a couple with yourself');
  }
  next();
});

CoupleSchema.virtual('isComplete').get(function() {
  return !!this.user2;
});

CoupleSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Couple', CoupleSchema);