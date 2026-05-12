const express = require('express');
const router = express.Router();
const { submitContactForm, getAllMessages } = require('../controllers/contactController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');

// Public route for everyone
router.post('/', submitContactForm);

// Admin route to view messages
router.get('/admin/all', authenticateUser, authorizeRoles('admin'), getAllMessages);

module.exports = router;