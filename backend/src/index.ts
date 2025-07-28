import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

import { routes } from './utils/router';
import './routes';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://dodesk-client-alb-1530009405.eu-north-1.elb.amazonaws.com',  // Add your frontend ALB URL
    'https://dodesk.app',  // Your custom domain
    'http://dodesk.app',   // HTTP fallback
    'https://api.dodesk.app',  // Backend HTTPS
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])         // Use environment variable for production
  ], 
  credentials: true // for using cookies or auth headers
}));

app.use(express.json());

app.use("/api", routes); // Register all routes from the utils/router.js

// Test route for health check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Dedicated health check route for ALB
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Test db connection
app.get("/test-db", async (req, res) => {
  try {
    const prisma = await import('./lib/prisma');
    await prisma.default.$queryRaw`SELECT NOW()`;
    console.log("Prisma Database connected!");
    res.json({ message: "Database connected!", time: new Date() });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

// Start the port
const PORT = parseInt(process.env.PORT || '5033', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}); 