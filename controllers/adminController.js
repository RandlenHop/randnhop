const StaffRequest = require("../models/StaffRequest");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getMasterMarketplace = async (req, res) => {
  const users = await User.find({}).select(
    "surname otherNames email phoneNumber photoUrl createdAt",
  );
  const staff = await StaffRequest.find({}).sort("-createdAt");
  const profile = await Profile.find({}).populate(
    "user",
    "surname otherNames email phoneNumber photoUrl",
  );

  res
    .status(StatusCodes.OK)
    .json({
      users,
      userCount: users.length,
      staff,
      staffRequestCount: staff.length,
      profile,
      profileCount: profile.length,
    });
};

const completeRequest = async (req, res) => {
  const { id } = req.params;
  const request = await StaffRequest.findById(id);
  if (!request) return res.status(404).json({ msg: "Request not found" });

  request.status = "Completed";
  request.reviewed = false;
  await request.save();

  if (request.assignedStaff?.length > 0) {
    await Profile.updateMany(
      { _id: { $in: request.assignedStaff } },
      { status: "Available", currentJobId: null },
    );
  }
  res.status(StatusCodes.OK).json({ success: true, request });
};

module.exports = {
  getMasterMarketplace,
  completeRequest,
  // add approveRequest, assignStaff, etc. here later
};
