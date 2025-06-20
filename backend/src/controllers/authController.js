const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();
const axios = require("axios");
const { createApi } = require("../utils/router");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return {
      status: 400,
      message: "Email is required"
    };
  }
  if (!password) {
    return {
      status: 400,
      message: "Password is required"
    };
  }

  try {
    // query to check if user exists
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    // if user does not exist, return error
    if (userResult.rows.length === 0) {
      //return res.status(401).json({ message: "Invalid credentials" });
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    // if user exists, check password
    const user = userResult.rows[0];

    // query to get workspaces for the user
    const workspacesResult = await pool.query(
      `SELECT workspaces.* 
       FROM workspaces
       JOIN workspace_members ON workspaces.id = workspace_members.workspace_id
       WHERE workspace_members.user_id = $1`,
      [user.id]
    );

    
    const workspaces = workspacesResult.rows;

    // compare password with hashed password in database
    const validPassword = await bcrypt.compare(password, user.password);

    // if password is invalid, return error
    if (!validPassword) {
      //return res.status(401).json({ message: "Invalid credentials" });
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    // if password is valid, generate JWT token
    console.log("User logged in:", user.email);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login successful");

   
    if (!user.default_workspace_id) {
      console.log(
        "No default workspace found for user"
      );
    }

    console.log(user.default_workspace_id);

    return {
      status: 200,
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name, // optional
        default_workspace_id: user.default_workspace_id,
      },
      workspaces: workspacesResult.rows
    };

  } catch (err) {
    console.error("Login error:", err.message);
    //res.status(500).json({ message: "Server error" });
    return {
      status: 500,
      message: "Server error",
      error: err.message
    }
  }
};

createApi().post("/login").noAuth(loginUser);
