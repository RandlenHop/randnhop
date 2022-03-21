const asyncHandler = require("express-async-handler");
const {
  successResponse: success,
  errorResponse: error,
} = require("../utilities/handleResponse");
const { generateToken, decodeToken } = require("../utilities/handleToken");

const { sendMessage } = require("../utilities/mail/handleMail");

const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const MODEL = require("../models/user");
const { errorHandler } = require("../middleware/errorMiddleware");

const generateId = asyncHandler(async (req, res) => {
  const regCode = await MODEL.create({});

  if (!regCode) {
    error(res, 500, "Failed to generate registration code. Please try again!");
  }

  success(res, 200, "Registration code generated successfully!", { regCode });
});

const register = asyncHandler(async (req, res) => {
  const { name, email, username, password, regCode } = req.body;

  async function checkRegCode() {
    let exist;
    try {
      exists = await MODEL.findOne({
        _id: regCode,
        username: { $exists: false },
      });
    } catch (error) {
      res.status(401);
      throw new Error(
        "Invalid registration code provided. Contact the administrator to issue you a registrtion code"
      );
    }

    if (!exists) {
      res.status(401);
      throw new Error("Registration code has been used already.");
    } else {
      return exists;
    }
  }

  const available = await checkRegCode();

  if (available) {
    const emailExists = await MODEL.findOne({ email });

    if (emailExists) {
      res.status(406);
      throw new Error("Email has already been taken. Please try another one.");
    }

    const usernameExists = await MODEL.findOne({ username });

    if (usernameExists) {
      res.status(406);
      throw new Error(
        "Username has already been taken. Please try another one."
      );
    }

    available.name = name;
    available.email = email;
    available.username = username;
    available.password = password;

    const newUser = await available.save();

    if (!newUser) {
      res.status(501);
      throw new Error("Registration failed. Please try again later.");
    }

    success(res, 201, "Your account has been created successfully.");
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const usernameExists = await MODEL.findOne({ username });

  if (!usernameExists) {
    res.status(404);
    throw new Error("Invalid username or password");
  }

  if (!usernameExists.isAccepted) {
    res.status(401);
    throw new Error("Please contact the admin to accept your account.");
  }

  if ((await usernameExists.matchPassword(password)) === false) {
    res.status(404);
    throw new Error("Invalid username or password");
  }

  res.status(200).json({
    token: generateToken(usernameExists._id),
    success: true,
    message: "Login successful",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const emailExists = await MODEL.findOne({ email });

  if (!emailExists) {
    res.status(404);
    throw new Error("Invalid email provided");
  }

  const token = generateToken(emailExists._id);

  const mailingData = {
    email,
    username: emailExists.username,
    subject: "Reset your password",
    todo: "Reset your password",
    mailExplainer:
      "You have received this message because you forgot your password. If you did not initialize this please ignore this mail.",
    mailPrompt: "Please click the button below to reset your password",
    url: CLIENT_URL + "/reset/password/" + token,
    buttonText: "RESET PASSWORD",
  };

  // console.log(CLIENT_URL + "/reset/password/" + token);
  sendMessage(mailingData);

  success(res, 200, "Message sent! Check your email for further instructions.");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;
  let poster;

  console.log("here");

  const decoded = decodeToken(token);

  try {
    poster = await MODEL.findById(decoded.fieldToSecure);
  } catch (error) {
    res.status(404);
    throw new Error("An invalid account detected.");
  }

  if (!poster) {
    res.status(404);
    throw new Error(
      "Invalid account details detected. Please restart the process again."
    );
  }

  if (await poster.matchPassword(password)) {
    res.status(400);
    throw new Error(
      "You cannot use your existing password. Please choose a new password."
    );
  }

  poster.password = password;
  const saved = await poster.save();

  if (!saved) {
    res.status(500);
    throw new Error("Password change failed. Please try again.");
  }

  const rMessage = "Your password has been reset successfully.";

  success(res, 200, rMessage);
});

const getAllId = asyncHandler(async (req, res) => {
  const user = req.query.user;

  let ids;
  if (user == "yes") {
    ids = await MODEL.find({ username: { $exists: true } }).select([
      "-password",
    ]);
  } else {
    ids = await MODEL.find({ username: { $exists: false } }).select([
      "-isAccepted",
      "-isAdmin",
      "-createdAt",
      "-updatedAt",
      "-__v",
    ]);
  }

  if (!ids) {
    res.status(404);
    throw new Error(
      "No unused registration code or user at the moment. Please generate new registration code"
    );
  } else {
    success(
      res,
      200,
      user === "yes"
        ? "Users has been retrieved successfully"
        : "Registarion code has been retrieved successfully.",
      {
        ids,
      }
    );
  }
});

const deleteId = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await MODEL.findByIdAndDelete(id);

    success(res, 200, "Registraion code / User deleted successfully.");
  } catch (error) {
    res.status(404);
    throw new Error("Failed to delete Id / user");
  }
});

const getSingleUser = asyncHandler(async (req, res) => {
  let user;
  try {
    user = await MODEL.findById(req.poster._id).select(["-password"]);

    success(res, 200, "User retrieved succesfully.", { user });
  } catch (error) {
    res.status(404);
    throw new Error("Failed to find user. Please try again.");
  }
});

const acceptAndRole = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const admin = req.query.admin;

  try {
    const user = await MODEL.findById(id).select(["-password"]);

    if (!user.isAccepted) {
      user.isAccepted = true;
    }

    if (admin === "yes") {
      user.isAdmin = true;
    }

    await user.save();

    const response =
      admin === "yes"
        ? "User has been assigned the role of an admin."
        : "User has been accepted.";

    success(res, 200, response);
  } catch (error) {
    res.status(404);
    throw new Error("Failed to accept user or assign role. Please try again.");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  let poster;

  const uMessage =
    "An error occured while updating your account, please try again.";
  const sMessage = "Your profile has been updated successfully.";

  try {
    poster = await MODEL.findById(req.poster._id).select(["-password"]);
  } catch (error) {
    res.status(404);
    throw new Error("An invalid account detetected.");
  }

  if (!poster) {
    res.status(501);
    throw new Error(uMessage);
  }

  poster.name = name || poster.name;
  poster.email = email || poster.email;
  if (password) {
    poster.password = password || poster.password;
  }

  const updatedPoster = await poster.save();

  // console.log(updatedPoster);

  if (!updatedPoster) {
    res.status(501);
    throw new Error(uMessage);
  }

  success(res, 200, sMessage, {
    name: updatedPoster.name,
    email: updatedPoster.email,
    username: updatedPoster.username,
  });
});

module.exports = {
  generateId,
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllId,
  deleteId,
  getSingleUser,
  acceptAndRole,
  updateProfile,
};
