const StaffRequest = require('../models/StaffRequest');
const { StatusCodes } = require('http-status-codes');

const createStaffRequest = async (req, res) => {
  // 1. Inject the logged-in user's ID
  req.body.user = req.user.userId;

  const { clientType } = req.body;

  // 2. Data Cleaning
  if (clientType === 'Individual') {
    delete req.body.repDetails;
    delete req.body.companyDetails;
  } 
  
  if (clientType === 'Organisation') {
    delete req.body.personalDetails;
  }

  // 3. Create the request
  const request = await StaffRequest.create(req.body);
  
  res.status(StatusCodes.CREATED).json({ 
    success: true, 
    msg: `${clientType} request created successfully`,
    request 
  });
};

const getMyRequests = async (req, res) => {
  const requests = await StaffRequest.find({ user: req.user.userId }).sort('-createdAt');
  
  res.status(StatusCodes.OK).json({ 
    success: true,
    count: requests.length, 
    requests 
  });
};

module.exports = { createStaffRequest, getMyRequests };