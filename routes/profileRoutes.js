const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getMyProfile } = require('../controllers/profileController');
const authenticateUser = require('../middlewares/auth'); 

router.route('/')
  .post(authenticateUser, createOrUpdateProfile) 
  .get(authenticateUser, getMyProfile);        

module.exports = router;