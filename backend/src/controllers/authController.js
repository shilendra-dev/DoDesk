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
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    // if user exists, check password
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    // if password is invalid, return error
    if (!validPassword) {
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    const workspacesResult = await pool.query(
      `SELECT w.id, w.name, w.slug 
      FROM workspaces w
      JOIN workspace_members wm ON w.id = wm.workspace_id
      WHERE wm.user_id = $1
      ORDER BY wm.joined_at DESC`,
      [user.id]
    );

    const workspaces = workspacesResult.rows;

    // if password is valid, generate JWT token
    console.log("User logged in:", user.email);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login successful");

    if (!user.default_workspace_id) {
      console.log("No default workspace found for user");
    }

    return {
      status: 200,
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        default_workspace_id: user.default_workspace_id,
      },
      workspaces: workspaces  
    };

  } catch (err) {
    console.error("Login error:", err.message);
    return {
      status: 500,
      message: "Server error",
      error: err.message
    }
  }
};

createApi().post("/login").noAuth(loginUser);
