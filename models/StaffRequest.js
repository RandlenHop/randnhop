const mongoose = require('mongoose');

const StaffRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientType: {
    type: String,
    enum: ['Organisation', 'Individual'],
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
    nationality: { type: String },
    businessLocation: { type: String },
    additionalComment: { type: String }
  },

  //  ORGANISATION FIELDS 
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
    industry: { 
      type: String,
      enum: ['Hospitality', 'Logistics', 'Technology','Retail', 'Construction', 'Corporate', 'Other'],
      required: function() { return this.clientType === 'Organisation'; }
    },
    companyRegNo: { type: String }
  },

  // SHARED FIELDS
  requestedStaff: [{
    role: { 
      type: String, 
      enum: ['Waiter', 'Cleaner', 'Driver', 'Cook', 'Laundry Man', 'Security Guard'],
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 }
  }],

  agreedToPolicy: {
    type: Boolean,
    required: [true, 'You must agree to the policy'],
    default: false
  },

  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Active', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('StaffRequest', StaffRequestSchema);