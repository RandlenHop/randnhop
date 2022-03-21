const jwt = require("jsonwebtoken");
const tokenHandler = {};
const secret = process.env.JWT_SECRET;

tokenHandler.generateToken = (fieldToSecure, duration) => {
  try {
    return jwt.sign({ fieldToSecure }, secret, {
      expiresIn: typeof duration === String ? duration : "3h",
    });
  } catch (error) {
    throw new Error(error);
  }
};

tokenHandler.decodeToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    res.status(422);
    throw new Error(
      "Invalid token detected or token has expired. Please restart the process again."
    );
  }
};

module.exports = tokenHandler;
