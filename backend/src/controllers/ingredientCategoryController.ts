import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Controller to get all ingredient categories (Read)
export const getAllIngredientCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const { data: ingredientCategories, error } = await supabaseAdmin
      .from("ingredient_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching ingredient categories:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(ingredientCategories);
  } catch (err) {
    console.error(
      "Unexpected error in getAllIngredientCategories controller:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get a single ingredient category by ID
export const getIngredientCategoryById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("ingredient_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Supabase error code for no rows found
        return res
          .status(404)
          .json({ error: "Ingredient category not found." });
      }
      throw error;
    }

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Error fetching ingredient category by ID:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to retrieve ingredient category." });
  }
};

// Controller to create a new ingredient category (Create)
export const createIngredientCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("ingredient_categories")
      .insert([{ name }])
      .select();

    if (error) {
      console.error("Error creating ingredient category:", error);
      return res.status(500).json({ error: error.message });
    }

    // Return the newly created category
    res.status(201).json(data[0]);
  } catch (err) {
    console.error(
      "Unexpected error in createIngredientCategory controller:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to update an existing ingredient category (Update)
export const updateIngredientCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("ingredient_categories")
      .update({ name })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating ingredient category:", error);
      return res.status(500).json({ error: error.message });
    }

    if (data && data.length === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    // Return the updated category
    res.status(200).json(data[0]);
  } catch (err) {
    console.error(
      "Unexpected error in updateIngredientCategory controller:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to delete an ingredient category (Delete)
export const deleteIngredientCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from("ingredient_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting ingredient category:", error);
      return res.status(500).json({ error: error.message });
    }

    // No content to return on a successful delete
    res.status(204).send();
  } catch (err) {
    console.error(
      "Unexpected error in deleteIngredientCategory controller:",
      err
    );
    res.status(500).json({ error: "Internal server error." });
  }
};
