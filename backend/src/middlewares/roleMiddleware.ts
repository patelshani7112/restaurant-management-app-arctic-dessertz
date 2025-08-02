// src/middleware/roleMiddleware.ts
import { Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";
import { AuthenticatedRequest } from "./authMiddleware";

// Middleware to check if the user is an Admin
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(403)
      .json({ error: "Access denied: No user found in request." });
  }

  try {
    // Fetch the user's profile to get their role
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("role_id")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res
        .status(403)
        .json({ error: "Access denied: User profile not found." });
    }

    // Now, fetch the role name from the role_id
    const { data: role, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("name")
      .eq("id", profile.role_id)
      .single();

    if (roleError || !role || role.name !== "Admin") {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient privileges." });
    }

    next();
  } catch (err) {
    console.error("Error in role middleware:", err);
    return res.status(500).json({ error: "Failed to verify user role." });
  }
};
