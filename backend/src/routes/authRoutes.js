const express = require("express");
const { loginUser } = require("../controllers/authController"); 

const router = express.Router();

//LogIn Route
router.post("/login", loginUser);



module.exports = router;


