const express = require('express');
const router = express.Router();
const { createStaffRequest, getMyRequests } = require('../controllers/staffRequestController');
const { authenticateUser, authorizeRoles }= require('../middlewares/auth');

// 1. PUBLIC/USER ROUTES (Authenticated)
router.route('/')
  .post(authenticateUser, createStaffRequest)
  .get(authenticateUser, getMyRequests);

// 2. ADMIN-ONLY ROUTES

const { getAllRequests } = require('../controllers/staffRequestController');
router.route('/all')
  .get(authenticateUser, authorizeRoles('admin'), getAllRequests);

module.exports = router;