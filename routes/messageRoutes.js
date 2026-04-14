const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require('../controllers/messageController');
const { authenticateUser } = require('../middlewares/auth');

router.post('/', authenticateUser, createMessage);
router.get('/', authenticateUser, getMessages);

module.exports = router;