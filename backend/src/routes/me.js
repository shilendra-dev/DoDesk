const express = require("express");
const pool = require("../config/db");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Middleware to protect the route
const verifyToken = (req, res, next) =>{
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({message: "No token is provided"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
        if(err) return res.status(403).json({message: "Failed to authenticate token"});
        req.user = decode;
        next();
    });
};

// api/me route
router.get('/me', verifyToken , async (req, res) => {
    try{
        const {id} = req.user;
        
        const user = await pool.query(`SELECT id, email, role FROM users WHERE id = $1`,[id]);
    
        if(user.rows.length === 0) return res.status(404).json({message: "user not found!"});

    
        res.json(user.rows[0]);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});


module.exports = router;