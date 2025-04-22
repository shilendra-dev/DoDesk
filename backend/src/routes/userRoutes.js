const express = require('express');
const router = express.Router();
const {createUser, getCurrentUser} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

//SignUp Route
router.post('/signup', createUser);

// Get Current User (Authenticated route)
router.get('/', protect, getCurrentUser);

module.exports = router;