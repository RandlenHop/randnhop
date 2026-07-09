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
    stateOfOrigin: { type: String, required: true },
    lgaOfOrigin: { type: String, required: true },
    country: { type: String, required: true },
    homeAddress: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    languageSkill: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    isDisabled: { type: String, default: "No" },
    isInternallyDisplaced: { type: String, default: "No" },

    // ── Next of Kin ──
    nextOfKin: {
      name: {
        type: String,
        required: [true, "Please provide the next of kin name"],
        trim: true,
      },
      relationship: {
        type: String,
        required: [true, "Please provide the relationship"],
        enum: {
          values: ["Parent", "Spouse", "Sibling", "Child", "Guardian", "Other"],
          message: "{VALUE} is not a valid relationship type",
        },
      },
      phoneNumber: {
        type: String,
        required: [true, "Please provide a primary phone number"],
        trim: true,
      },
      alternativePhoneNumber: {
        type: String,
        default: "",
        trim: true,
      }, // Optional field
      address: {
        type: String,
        required: [true, "Please provide an address"],
        trim: true,
      },
    },

    // ── Job Experience ──
    hasNoPriorExperience: {
      type: Boolean,
      default: false,
    },
    jobExperience: [
      {
        organization: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        from: { type: String, required: true },
        to: { type: String, default: "" },
        isCurrent: { type: Boolean, default: false },
        reference: {
          name: { type: String, required: true, trim: true },
          relationship: { type: String, required: true, trim: true },
          phone: { type: String, required: true, trim: true },
          email: { type: String, default: "", trim: true }, // Optional field
        },
      },
    ],
    // ── Professional Details ──
    profilePicture: {
      type: String,
      default: "",
    },
    primarySkills: { type: String, required: true },
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
