const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'not authorized'})
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        //CHECKING IF USER EXIST IN DB
        const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [decoded.id]);

        if(userResult.rows.length===0){
            return res.status(401).json({message: "no user found"});
        }
        req.user = userResult.rows[0];
        next();
    }catch(err){
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

module.exports = { protect };
