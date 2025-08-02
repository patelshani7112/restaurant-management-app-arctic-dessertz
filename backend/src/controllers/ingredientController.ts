// backend/src/controllers/ingredientController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// GET all ingredients
// GET all ingredients
export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin.from("ingredients").select(`
      id,
      name,
      category_id,
      category_id (
        name
      )
    `);

    if (error) throw error;

    // Map the data to a cleaner format and safely handle null values
    const ingredients = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category_id: item.category_id?.id,
      category_name: item.category_id?.name, // <-- Updated to safely access the name
    }));

    res.status(200).json(ingredients);
  } catch (error: any) {
    console.error("Error fetching ingredients:", error.message);
    res.status(500).json({ error: "Failed to fetch ingredients." });
  }
};

// GET a single ingredient by ID
export const getIngredientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("ingredients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching ingredient:", error.message);
    res.status(500).json({ error: "Failed to fetch ingredient." });
  }
};

// POST a new ingredient
export const createIngredient = async (req: Request, res: Response) => {
  const { name, category_id } = req.body;

  if (!name || !category_id) {
    return res
      .status(400)
      .json({ error: "Name and category_id are required." });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("ingredients")
      .insert({ name, category_id })
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error("Error creating ingredient:", error.message);
    res.status(500).json({ error: "Failed to create ingredient." });
  }
};

// PUT to update an ingredient by ID
export const updateIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category_id } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("ingredients")
      .update({ name, category_id })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error updating ingredient:", error.message);
    res.status(500).json({ error: "Failed to update ingredient." });
  }
};

// DELETE an ingredient by ID
export const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from("ingredients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Ingredient deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting ingredient:", error.message);
    res.status(500).json({ error: "Failed to delete ingredient." });
  }
};
