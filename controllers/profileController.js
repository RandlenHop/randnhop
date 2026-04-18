const Profile = require('../models/Profile');
const { StatusCodes } = require('http-status-codes');

const createOrUpdateProfile = async (req, res) => {
  try {
    // Add the user ID to the body from the auth middleware
    const profileData = {
      ...req.body,
      user: req.user.userId 
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
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
    'user', 
    'surname otherNames email phoneNumber'
  );
  
  if (!profile) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Profile not found' });
  }
  
  res.status(StatusCodes.OK).json(profile);
};

// Route to edit and update profile 
// const editProfile = 



module.exports = { createOrUpdateProfile, getMyProfile };