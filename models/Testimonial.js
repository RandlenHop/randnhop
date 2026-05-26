const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide a role or designation (e.g., Event Planner, Client)'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Please provide the testimonial text'],
      maxlength: [500, 'Testimonial cannot be more than 500 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    avatar: {
      type: String,
      default: '', // Optional image URL
    },
    isApproved: {
      type: Boolean,
      default: false, // This maps to the "Show on website" toggle
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);