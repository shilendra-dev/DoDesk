const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const router = express.Router();
require("dotenv").config();

//Middleware to protect the route
const verifyAdmin = (req, res, next) =>{
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({message: "No token is provided"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
        if(err) return res.status(403).json({message: "Failed to authenticate token"});

        if(decode.role !== 'admin'){
            return res.status(403).json({message: "Only admins can perform this action"});
        }

        req.user = decode;
        next();
    });
};

//post api for user creation 
router.post("/create-user", verifyAdmin, async (req, res) => {
    const {name, email, password, role} = req.body;

    if(!name || !email || !password || !role){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        const userExists = await pool.query(`SELECT FROM users WHERE email = $1`,[email]);
        if(userExists.rows.length >0){
            return res.status(400).json({message: "User already exists"});
        }

        await pool.query(`INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)`,[id, name , email, hashedPassword, role]);

        res.status(201).json({message: "User successfully created!!"})
    }catch(err){
        console.error("Error creating user: ". err);
        res.status(500).json({message: err.message});
    }
});


module.exports = router