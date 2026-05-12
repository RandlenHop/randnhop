const mongoose = require('mongoose');

const StaffRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientType: {
    type: String,
    enum: ['Organisation','Private'],
    required: [true, 'Please specify if this is an Organisation or Individual request']
  },

  // PRIVATE INDIVIDUAL FIELDS 
  personalDetails: {
    surname: { 
      type: String, 
      required: function() { return this.clientType === 'Individual'; } 
    },
    otherName: { type: String },
    email: { 
      type: String,
      required: function() { return this.clientType === 'Individual'; } 
    },
    phoneNo: { type: String },
    country: { type: String },
    businessLocation: { type: String },
    additionalComment: { type: String }
  },

  // ORGANISATION FIELDS 
  repDetails: {
    surname: { 
      type: String,
      required: function() { return this.clientType === 'Organisation'; } 
    },
    otherNames: { type: String }, 
    phoneNumber: { type: String },
    jobRole: { type: String }
  },
  companyDetails: {
    companyName: { 
      type: String,
      required: function() { return this.clientType === 'Organisation'; } 
    },
    companyEmail: { type: String },
    companyPhone: { type: String },
    companyAddress: { type: String },
    country: { type: String },
    industry: { 
      type: String,
      required: function() { return this.clientType === 'Organisation'; }
    },
    companyRegNo: { type: String },
    additionalComment: { type: String }

  },

  // ROLES
  requestedStaff: [{
    role: { 
      type: String, 
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 }
  }],

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed', 'Rejected'], 
    default: 'Pending'
  },
  startDate: { type: String, default: "" }, 
  endDate: { type: String, default: "" },   
  assignedStaff: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Profile' 
  }],

  // REVIEW
  reviewed: { 
    type: Boolean, 
    default: false 
  }, 
  reviews: [{
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    submittedAt: { type: Date, default: Date.now }
  }], 

  agreedToPolicy: {
    type: Boolean,
    required: [true, 'You must agree to the policy'],
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('StaffRequest', StaffRequestSchema);