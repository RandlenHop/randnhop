const express = require('express');
const router = express.Router();
const {
  createCouple,
  joinCouple,
  getCoupleStatus,
} = require('../controllers/coupleController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/create', authenticateUser, createCouple);
router.post('/join', authenticateUser, joinCouple);
router.get('/status', authenticateUser, getCoupleStatus);


module.exports = router;