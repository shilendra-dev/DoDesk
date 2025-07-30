import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    (req as any).user = session.user;
    next();
    return;
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const protect = requireAuth;