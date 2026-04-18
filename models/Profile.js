const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    //STEP 1 FIELDS
    nationality: { type: String, required: true },
    homeAddress: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    languageSkill: { type: String, required: true,enum: ["English", "Yoruba", "French"] },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    isDisabled: { type: String, default: "No" }, 
    isInternallyDisplaced: { type: String, default: "No" }, 

    // STEP 2 FIELDS 
    primarySkills: { type: String, required: true,enum: [
    'Waiter', 
    'Cleaner', 
    'Driver', 
    'Cook', 
    'Laundry Man', 
    'Security Guard', 
    'House Help', 
    'Gardener'
  ], },
    yearsOfExperience: { type: Number, default: 0 },
    additionalSkill: { type: String },
    bio: { type: String, maxLength: 1000 },
    educationalQualification: { type: String, required: true },

    // Policy Agreement (Stored as a timestamp of when they agreed)
    agreedToPolicy: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", ProfileSchema);
