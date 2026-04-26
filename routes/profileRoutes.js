const express = require('express');
const router = express.Router();
const { 
  createOrUpdateProfile, 
  getMyProfile, 
  getStaffMarketplace 
} = require('../controllers/profileController');
const authenticateUser = require('../middlewares/auth'); 

router.route('/')
  .post(authenticateUser, createOrUpdateProfile) 
  .get(authenticateUser, getMyProfile);


router.route('/marketplace')
  .get(authenticateUser, getStaffMarketplace);

module.exports = router;