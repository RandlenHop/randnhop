const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { errorResponse } = require("../utilities/handleResponse");
const res = require("express/lib/response");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },

    email: {
      type: String,
    },

    username: {
      type: String,
    },
    password: {
      type: String,
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// This method matches a poster's password and can be used as: await ThePosterFromDatabase.matchPassword(password)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * @description This rehashes a password if updated or changed.
 */
userSchema.pre("save", async function (next) {
  // This first one checks to see that it doesnt rehash a password on login or registe
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// This rehashes a password if updated or changed.

// userSchema.statics.checkRegCode = function (regCode) {
//   try {
//     const exists = this.findById(regCode);

//     console.log(exists.);

//     if (exists.username) {
//       errorResponse(res, 404, "Registration code has been used already.");
//     } else {
//       return exists;
//     }
//   } catch (error) {
//     errorResponse(res, 404, "Registration code is invalid.");
//   }
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
