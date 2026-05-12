const express = require('express');
const router = express.Router();
const { register, login ,adminGateLogin,logout} = require('../controllers/authController');
const { getAllUsers } = require('../controllers/authController');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/admin-gate-login', adminGateLogin); 
router.route('/users').get(authenticateUser, authorizeRoles('admin'), getAllUsers);
module.exports = router;