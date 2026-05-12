const express = require('express');
const router = express.Router();
const { 
  getMasterMarketplace ,
  approveRequest, 
  rejectRequest, 
  setDates, 
  assignStaffToRequest,
  completeRequest 
} = require('../controllers/adminController');
const{getStaffMarketplace}= require('../controllers/profileController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');

//for Admin only
router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/marketplace', getStaffMarketplace);
router.get('/mastermarketplace', getMasterMarketplace);


// router.patch('/:id/approve', approveRequest);
// router.patch('/:id/reject', rejectRequest);  
// router.patch('/:id/dates', setDates);       
// router.patch('/:id/assign', assignStaffToRequest);
router.patch('/:id/getMasterMarketplace',getMasterMarketplace); 

router.patch('/:id/complete', completeRequest); 

module.exports = router;