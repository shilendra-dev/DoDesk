const express = require("express");
const cors = require ("cors");
require("dotenv").config();

const app = express();

const { routes } = require("./utils/router");
require("./routes")

//middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], 
    credentials: true // for using cookies or auth headers
  }));

app.use(express.json());

app.use("/api", routes); // Register all routes from the utils/router.js

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
const PORT = process.env.PORT || 5033;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
