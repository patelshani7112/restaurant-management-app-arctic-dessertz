// backend/src/controllers/categoryController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Controller to get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("name", { ascending: true }); // Order by name for convenience

    if (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error("Unexpected error in getAllCategories controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// You can add create, update, delete category functions here later if needed
