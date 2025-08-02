// backend/src/controllers/subCategoryController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Get all sub-categories (optional, mainly for debugging/overview)
export const getAllSubCategories = async (req: Request, res: Response) => {
  try {
    const { data: subCategories, error } = await supabaseAdmin
      .from("sub_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching all sub-categories:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(subCategories);
  } catch (err) {
    console.error("Unexpected error in getAllSubCategories controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get sub-categories by category_id (crucial for dynamic frontend dropdown)
export const getSubCategoriesByCategoryId = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required." });
  }

  try {
    const { data: subCategories, error } = await supabaseAdmin
      .from("sub_categories")
      .select("*")
      .eq("category_id", categoryId) // Filter by the provided categoryId
      .order("name", { ascending: true });

    if (error) {
      console.error(
        `Error fetching sub-categories for category ${categoryId}:`,
        error
      );
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(subCategories);
  } catch (err) {
    console.error(
      "Unexpected error in getSubCategoriesByCategoryId controller:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

// (You can add create, update, delete sub-category functions here later if needed)
