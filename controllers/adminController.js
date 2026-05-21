const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const StaffRequest = require("../models/StaffRequest");
const Profile = require("../models/Profile");
const User = require("../models/User");

// 1. DASHBOARD & MONITORING MANAGEMENT
const getMasterMarketplace = async (req, res) => {
  const users = await User.find({}).select(
    "surname otherNames email phoneNumber photoUrl createdAt"
  );
  const staff = await StaffRequest.find({}).sort("-createdAt");
  const profile = await Profile.find({}).populate(
    "user",
    "surname otherNames email phoneNumber photoUrl"
  );

  res.status(StatusCodes.OK).json({
    users,
    userCount: users.length,
    staff,
    staffRequestCount: staff.length,
    profile,
    profileCount: profile.length,
  });
};

// 2. WORKFLOW ORDER PIPELINE MANAGEMENT
const approveRequest = async (req, res) => {
  const { id } = req.params;

  const request = await StaffRequest.findById(id);
  
  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `No request found with id: ${id}` 
    });
  }

  if (request.status === 'Approved') {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'This request has already been approved' 
    });
  }

  request.status = 'Approved';
  await request.save();

  res.status(StatusCodes.OK).json({ 
    success: true, 
    msg: 'Staff request approved successfully', 
    request 
  });
};


const rejectRequest = async (req, res) => {
  const { id } = req.params;

  const request = await StaffRequest.findById(id);
  
  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `No request found with id: ${id}` 
    });
  }

  if (request.status === 'Rejected') {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'This request has already been rejected' 
    });
  }

  request.status = 'Rejected';
  await request.save();

  // Clean-up: If any staff were tentatively assigned, reset them back to Available
  if (request.assignedStaff && request.assignedStaff.length > 0) {
    await Profile.updateMany(
      { _id: { $in: request.assignedStaff } },
      { status: 'Available', currentJobId: null }
    );
  }

  res.status(StatusCodes.OK).json({ 
    success: true, 
    msg: 'Staff request rejected successfully', 
    request 
  });
};



const assignStaffToRequest = async (req, res) => {
  const { id } = req.params; 
  const { staffIds } = req.body; 

  if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'Please provide an array of staff profile IDs' 
    });
  }

  const request = await StaffRequest.findById(id);
  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `No request found with id: ${id}` 
    });
  }

  if (request.status === 'Pending') {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'Please approve the request before assigning staff' 
    });
  }

  request.assignedStaff = staffIds;
  request.status = 'Ongoing'; 
  await request.save();

  await Profile.updateMany(
    { _id: { $in: staffIds } },
    { 
      status: 'On Job', 
      currentJobId: id 
    }
  );

  res.status(StatusCodes.OK).json({ 
    success: true, 
    msg: 'Staff assigned and deployment started successfully', 
    request 
  });
};


const setDates = async (req, res) => {
  const { id } = req.params; 
  const { startDate, endDate } = req.body; 
  if (!startDate && !endDate) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'Please provide a startDate or endDate to update' 
    });
  }

  const request = await StaffRequest.findById(id);
  
  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `No request found with id: ${id}` 
    });
  }

  if (startDate) request.startDate = new Date(startDate);
  if (endDate) request.endDate = new Date(endDate);

  await request.save();

  res.status(StatusCodes.OK).json({ 
    success: true, 
    msg: 'Deployment dates updated successfully', 
    request 
  });
};



const completeRequest = async (req, res) => {
  const { id } = req.params;
  const request = await StaffRequest.findById(id);
  if (!request) return res.status(StatusCodes.NOT_FOUND).json({ msg: "Request not found" });

  request.status = "Completed";
  request.reviewed = false; // Flags client system dashboard that review form is required
  await request.save();

  // Release workers from operational locks back into pool
  if (request.assignedStaff?.length > 0) {
    await Profile.updateMany(
      { _id: { $in: request.assignedStaff } },
      { status: "Available", currentJobId: null },
    );
  }
  res.status(StatusCodes.OK).json({ success: true, request });
};


// 3. RATING & REVIEWS INTEGRATION PORTAL


const submitReview = async (req, res) => {
  const { reqId } = req.params;
  const { staffId, rating, comment } = req.body;

  if (!staffId || !rating) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'Please provide both a staffId and a rating' 
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'Rating must be an integer between 1 and 5' 
    });
  }

  const request = await StaffRequest.findById(reqId);
  if (!request) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `Request with id ${reqId} not found` 
    });
  }

  if (request.status !== 'Completed') {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      msg: 'You can only review requests that are marked as Completed' 
    });
  }

  if (request.reviewed) {
    return res.status(StatusCodes.CONFLICT).json({ 
      success: false, 
      msg: 'This request has already been reviewed' 
    });
  }

  const staffMember = await Profile.findById(staffId);
  if (!staffMember) {
    return res.status(StatusCodes.NOT_FOUND).json({ 
      success: false, 
      msg: `Staff profile with id ${staffId} not found` 
    });
  }

  const reviewObject = {
    rating: Number(rating),
    comment: comment || "",
    submittedAt: new Date().toISOString(),
    reviewedReqId: reqId
  };

  request.reviews = request.reviews || [];
  request.reviews.push(reviewObject);
  request.reviewed = true; 
  await request.save();

  staffMember.reviews = staffMember.reviews || [];
  staffMember.reviews.push(reviewObject);
  staffMember.totalReviews = (staffMember.totalReviews || 0) + 1;

  const totalRatingSum = staffMember.reviews.reduce((sum, current) => sum + current.rating, 0);
  const calculatedAverage = totalRatingSum / staffMember.reviews.length;
  staffMember.averageRating = Math.round(calculatedAverage * 10) / 10;

  await staffMember.save();

  res.status(StatusCodes.CREATED).json({
    message: "Review submitted successfully",
    request,
    staff: staffMember
  });
};


module.exports = {
  getMasterMarketplace,
  approveRequest,
  rejectRequest,
  assignStaffToRequest,
  setDates,
  completeRequest,
  submitReview
};