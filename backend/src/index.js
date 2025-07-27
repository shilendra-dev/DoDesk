const express = require("express");
const cors = require ("cors");
require("dotenv").config();

const app = express();

const { routes } = require("./utils/router");
require("./routes")

//middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        'http://dodesk-client-alb-1530009405.eu-north-1.elb.amazonaws.com',  // Add your frontend ALB URL
        process.env.FRONTEND_URL         // Use environment variable for production
    ], 
    credentials: true // for using cookies or auth headers
  }));

app.use(express.json());

app.use("/api", routes); // Register all routes from the utils/router.js

//test route for health check
app.get("/", (req, res) => {
    res.status(200).send("OK");
});

// dedicated health check route for ALB
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});
//test db connection
app.get("/test-db", async(req, res) => {
    try{
        const prisma = require("./lib/prisma");
        await prisma.$queryRaw`SELECT NOW()`;
        console.log("Prisma Database connected!");
        res.json({message: "Database connected!", time: new Date()});
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

//Start the port

app.listen(process.env.PORT || 5033, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${process.env.PORT || 5033}`)
});
