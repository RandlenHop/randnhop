const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: [true, "Please provide surname"],
    minlength: 3,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user', 
  },
  otherNames: { type: String, required: [true, "Please provide other names"],trim: true },
  phoneNumber: { type: String, required: [true, "Please provide phone number"] },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
      lowercase: true,
    },
  
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
photoUrl: {
  type: String,
  default: 'https://res.cloudinary.com/placeholder-avatar.png', 
},
passwordResetToken: String,
passwordResetExpires: Date,
},{ timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
},);

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, surname: this.surname ,role: this.role},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
