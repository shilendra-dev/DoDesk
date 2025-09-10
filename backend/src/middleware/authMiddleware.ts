import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

type SessionWithUser = Awaited<
  ReturnType<typeof auth.api.getSession>
>;

export interface AuthenticatedRequest extends Request {
  user?: NonNullable<SessionWithUser>["user"];
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if(value != undefined) {
        headers.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    }

    // Extract session from request headers
    const session = await auth.api.getSession({
      headers,
    });

    // If no session found, return 401 Unauthorized
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user to request object
    req.user = session.user;
    
    // Continue to next middleware/controller
    next();
    return;
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const protect = requireAuth;