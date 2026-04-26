const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  // Set default error
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  // 1. Handle MongoDB Duplicate Key Error (11000)
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // 2. Handle Mongoose Validation Errors (e.g. "Path email is required")
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // 3. Handle CastErrors (e.g. wrong ID format for Mongoose)
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Send the final response
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

const notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route does not exist' });
};

module.exports = {
  notFound,
  errorHandlerMiddleware,
};