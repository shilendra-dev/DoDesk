const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
require("dotenv").config();
const { createApi } = require("../utils/router");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return {
      status: 400, //bad request
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
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });
    // if user does not exist, return error
    if (!user) {
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    const validPassword = await bcrypt.compare(password, user.password); //compare password with hashed password

    // if password is invalid, return error
    if (!validPassword) {
      return {
        status: 401,
        message: "Invalid credentials"
      };
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        creatorId: user.id
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // if password is valid, generate JWT token
    console.log("User logged in:", user.email);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Login successful");

    if (!user.lastActiveWorkspaceId) {
      console.log("No last active workspace found for user");
    }

    return {
      status: 200,
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastActiveWorkspaceId: user.lastActiveWorkspaceId,
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