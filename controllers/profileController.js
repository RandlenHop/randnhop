const Profile = require("../models/Profile");
const { StatusCodes } = require("http-status-codes");

const createOrUpdateProfile = async (req, res) => {
  try {
    // Add the user ID to the body from the auth middleware
    const profileData = {
      ...req.body,
      user: req.user.userId,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      profileData,
      { new: true, upsert: true, runValidators: true },
    );

    res.status(StatusCodes.OK).json({ success: true, profile });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};

// Route to get the full profile including User info
const getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.userId }).populate(
    "user",
    "surname otherNames email phoneNumber",
  );

  if (!profile) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "Profile not found" });
  }

  res.status(StatusCodes.OK).json(profile);
};

const getStaffMarketplace = async (req, res) => {
  // 1. Get total for the dashboard cards
  const totalStaff = await Profile.countDocuments({ agreedToPolicy: true });

  //  Getting counts for specific high-demand roles
  const cookCount = await Profile.countDocuments({ primarySkills: "Cook" });
  const driverCount = await Profile.countDocuments({ primarySkills: "Driver" });

  // 2. Fetch all profiles and "Populate" the user's name from the User model
  const staffList = await Profile.find({
    agreedToPolicy: true,
    user: { $ne: req.user.userId }, // exclude my own profile in the marketplace
  })
    .populate("user", "surname otherNames") // names from your User model
    .select("primarySkills yearsOfExperience bio gender"); // other info that wants to be grabed

  res.status(StatusCodes.OK).json({
    success: true,
    stats: {
      totalStaff,
      cookCount,
      driverCount,
    },
    staff: staffList,
  });
};

module.exports = { createOrUpdateProfile, getMyProfile, getStaffMarketplace };
