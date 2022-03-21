const responseHandle = {};

responseHandle.errorResponse = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

responseHandle.successResponse = (res, status, message, data) => {
  res.status(status).json({
    message,
    data,
    dataLength: typeof data === Array ? data.length : null,
  });
};

module.exports = responseHandle;
