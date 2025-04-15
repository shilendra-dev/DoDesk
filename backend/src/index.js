const express = require("express");
const cors = require ("cors");
const pool = require("./config/db")
require("dotenv").config();
const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/authRoutes")
const me = require("./routes/me")
const adminUserRoutes = require("./routes/adminUserRoutes")

const app = express();

//middleware
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true // if you're using cookies or auth headers
  }));

app.use(express.json());
app.use("/", authRoutes);
app.use("/api/auth", me);
app.use("/api/admin", adminUserRoutes);


//test db connection
app.get("/test-db", async(req, res) => {
    try{
        const result = await pool.query("SELECT NOW();");
        res.json({message: "Database connected!", time: result.rows[0]});
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

//Start the port
const PORT = process.env.PORT || 5033;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
