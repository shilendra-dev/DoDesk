const express = require("express");
const pool = require("../config/db");

const jwt = require("jsonwebtoken");
const { createApi } = require("../utils/router");

//Middleware to protect the route
const verifyToken = (req, res, next) =>{
    const token = req.headers['authorization'];

    if(!token){
        //return res.status(403).json({message: "No token is provided"});
        return {
            status: 403,
            message: "No token is provided"
        }
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
        if(err) return res.status(403).json({message: "Failed to authenticate token"});
        req.user = decode;
        next();
    });
};


// api/me route
const meRoute = async (req, res) => {
    try{
        const {id} = req.user; 
        
        const user = await pool.query(`SELECT id, email, name FROM users WHERE id = $1`,[id]);
    
        if(user.rows.length === 0) return res.status(404).json({message: "user not found!"});

        return {
            status: 200,
            message: "User fetched successfully",
            user: user.rows[0]
        };
    }catch(err){
        // res.status(500).json({message: err.message});
        console.error("Error fetching user:", err);
        return {
            status: 500,
            message: "Failed to fetch user",
            error: err.message
        };
    }
};

createApi().get('/auth/me').authSecure(meRoute);