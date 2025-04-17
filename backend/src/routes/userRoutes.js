const express = require('express');
const router = express.Router();
const {createUser} = require('../controllers/userController')

//SignUp Route
router.post('/signup', createUser);

module.exports = router;