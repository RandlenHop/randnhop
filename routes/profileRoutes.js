const express = require('express');
const router = express.Router();
const { 
  createOrUpdateProfile, 
  getMyProfile, 
  getStaffMarketplace 
} = require('../controllers/profileController');
const { authenticateUser, authorizeRoles }= require('../middlewares/auth'); 

router.route('/')
  .post(authenticateUser, createOrUpdateProfile) 
  .get(authenticateUser, getMyProfile);


router.route('/marketplace')
.get(authenticateUser, authorizeRoles('admin'), getStaffMarketplace);
module.exports = router;