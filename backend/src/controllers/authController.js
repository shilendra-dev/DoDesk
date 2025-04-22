const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const workspacesResult = await pool.query(
      `SELECT workspaces.* 
       FROM workspaces
       JOIN workspace_members ON workspaces.id = workspace_members.workspace_id
       WHERE workspace_members.user_id = $1`,
      [user.id]
    );
    const workspaces = workspacesResult.rows;

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log("Login successful");

    //res.status(200).json({ token, id: user.id, workspaces });

    res.status(200).json({
      token,

      user: {
        id: user.id,
        email: user.email,
        name: user.name, // optional
        default_workspace_id: user.default_workspace_id,
      },
      workspaces, // assuming you're still sending this to store in context
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };
