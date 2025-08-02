// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";
import { User } from "@supabase/supabase-js";

// Extend the Request object to include the 'user' property
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware to verify a user's JWT token
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or malformed." });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ error: "Failed to authenticate token." });
  }
};
