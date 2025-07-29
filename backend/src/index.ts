import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';

dotenv.config();

const app = express();

// Configure CORS first
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://dodesk-client-alb-1530009405.eu-north-1.elb.amazonaws.com',
    'https://dodesk.app',
    'http://dodesk.app',
    'https://api.dodesk.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  ],
  credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth)); // For Express v5

app.use(cookieParser());
app.use(express.json());
import { routes } from './utils/router';
import './routes';
app.use("/api", routes);

// Health checks
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

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

const PORT = parseInt(process.env.PORT || '5033', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});