const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    if(!email) return res.status(400).json({message: "email is required"});
    if(!password) return res.status(400).json({message: "password is required"});

    try{
        //getting user data
        const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);

        //if no email is found
        if(user.rows.length === 0){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        //checking password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        
        //if passwords do not match
        if(!validPassword){
            return res.status(401).json({message: "Passwords do not match"});
        }

        const token = jwt.sign(
            {id: user.rows[0].id},
            process.env.JWT_SECRET,
            {expiresIn:"2h"}
        );
        console.log("login sucessfull")
        res.status(200).json({token, id: user.rows[0].id});

    }catch(err){
        res.status(500).json({message: err.message});
    }
};

module.exports= {loginUser};