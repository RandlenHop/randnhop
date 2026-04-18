const express = require('express');
const router = express.Router();
const { createStaffRequest, getMyRequests } = require('../controllers/staffRequestController');
const auth = require('../middlewares/auth');

router.route('/')
  .post(auth, createStaffRequest)
  .get(auth, getMyRequests);

module.exports = router;