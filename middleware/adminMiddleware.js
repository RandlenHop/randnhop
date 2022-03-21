const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/user");
const { decodeToken } = require("../utilities/handleToken");

/**
 * @description This middleware checks the poster admin token supplied as Bearer authorization
 * @required Bearer Authorization
 */

const protectAdminPoster = asyncHandler(async (req, res, next) => {
  let receivedToken = req.headers.authorization;
  let token;
  const eMessage = "You are not authorized to use this service, token failed";

  if (receivedToken && receivedToken.startsWith("Bearer")) {
    try {
      token = receivedToken.split(" ")[1];

      const decoded = decodeToken(token);

      const poster = await UserModel.findOne({
        _id: decoded.fieldToSecure,
        isAccepted: true,
        isAdmin: true,
      }).select("-password");

      if (!poster) {
        res.status(401);
        throw new Error(eMessage);
      }

      req.poster = poster;

      next();
    } catch (error) {
      res.status(401);
      throw new Error(eMessage);
    }
  }

  if (!token) {
    res.status(401);
    throw new Error(
      "You are not authorized to use this service, no token provided."
    );
  }
});

module.exports = protectAdminPoster;
