const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/authentication');

const {
  getApprovedTestimonials,
  getAllTestimonialsForAdmin,
  createTestimonialByAdmin,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');

router.route('/').get(getApprovedTestimonials);


router.route('/admin')
  .get([authenticateUser, authorizeRoles('admin')], getAllTestimonialsForAdmin)
  .post([authenticateUser, authorizeRoles('admin')], createTestimonialByAdmin);

router.route('/admin/:id')
  .patch([authenticateUser, authorizeRoles('admin')], updateTestimonial)
  .delete([authenticateUser, authorizeRoles('admin')], deleteTestimonial);

module.exports = router;