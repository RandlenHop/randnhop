const StaffRequest = require('../models/StaffRequest');
const { StatusCodes } = require('http-status-codes');

const createStaffRequest = async (req, res) => {
  // 1. Inject the logged-in user's ID
  req.body.user = req.user.userId;

  const { clientType } = req.body;

  // 2. Data Cleaning
  if (clientType === 'Private') {
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


const getAllRequests = async (req, res) => {
  const requests = await StaffRequest.find({})
    .populate('user', 'surname otherNames email') // Shows who made the request
    .sort('-createdAt');

  res.status(StatusCodes.OK).json({ 
    success: true, 
    count: requests.length, 
    requests 
  });
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'Approved' or 'Rejected'

  const request = await StaffRequest.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true, runValidators: true }
  );

  if (!request) {
    return res.status(404).json({ msg: 'Request not found' });
  }

  res.status(StatusCodes.OK).json({ success: true, request });
};
module.exports = { createStaffRequest, getMyRequests,getAllRequests ,updateRequestStatus};