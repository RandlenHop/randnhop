const express = require('express');
const router = express.Router();
const { 
  getMasterMarketplace ,
  approveRequest, 
  rejectRequest, 
  setDates, 
  assignStaffToRequest,
  completeRequest,
  submitReview
} = require('../controllers/adminController');
const{getStaffMarketplace}= require('../controllers/profileController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');

//for Admin only
router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/marketplace', getStaffMarketplace);
router.get('/mastermarketplace', getMasterMarketplace);


router.patch('/:id/approve', approveRequest);
router.patch('/:id/reject', rejectRequest);  
router.patch('/:id/date', setDates);       
router.patch('/:id/assign', assignStaffToRequest);
router.patch('/:id/complete', completeRequest); 
router.patch('/:id/getMasterMarketplace',getMasterMarketplace); 

router.post('/profile/:id/review', submitReview);


module.exports = router;