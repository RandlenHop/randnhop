// middlewares/errorMiddleware.js

const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: 'Something went wrong, please try again' });
};

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route does not exist' });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  // Handle duplicate email error from MongoDB
   let customError = {
    // set default
    statusCode: err.statusCode || 500,
    msg: err.message || 'Something went wrong',
  };
    // Duplicate key error
  if (err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
    customError.statusCode = 400;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
}
module.exports = {
  errorHandler,
  notFound,
  errorHandlerMiddleware
};
