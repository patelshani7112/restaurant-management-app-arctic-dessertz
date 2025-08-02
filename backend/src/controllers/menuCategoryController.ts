// backend/src/controllers/menuCategoryController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

interface MenuCategory {
  id: string;
  name: string;
}

// ✅ Controller to get all menu categories
export const getAllMenuCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching menu categories:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error in getAllMenuCategories controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Controller to get a single menu category by ID
export const getMenuCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("id, name")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching single menu category:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error in getMenuCategory controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Controller to create a new menu category
export const createMenuCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ name }])
      .select("id, name");

    if (error) {
      console.error("Error creating menu category:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data?.[0]);
  } catch (err) {
    console.error("Unexpected error in createMenuCategory controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Controller to update an existing menu category
export const updateMenuCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update({ name })
      .eq("id", id)
      .select("id, name");

    if (error) {
      console.error("Error updating menu category:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Unexpected error in updateMenuCategory controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// ✅ Controller to delete a menu category with improved error handling
// export const deleteMenuCategory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const { error, count } = await supabaseAdmin
//       .from("categories")
//       .delete()
//       .eq("id", id)
//       .select("id");

//     if (error) {
//       // Check for a specific foreign key constraint error
//       if (error.code === "23503") {
//         // This is a common Postgres code for foreign key violations
//         console.error("Foreign key constraint violation:", error.message);
//         return res.status(409).json({
//           error: "Cannot delete category while it is in use by menu items.",
//         });
//       }
//       console.error("Error deleting menu category:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     if (!count || count === 0) {
//       return res.status(404).json({ error: "Category not found." });
//     }

//     res.status(204).send();
//   } catch (err) {
//     console.error("Unexpected error in deleteMenuCategory controller:", err);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };

// in backend/src/controllers/menuCategoryController.ts
export const deleteMenuCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Start a transaction (optional but good practice)
    await supabaseAdmin.rpc("pg_begin");

    // 1. Delete all sub-categories linked to this category
    const { error: subCategoryError } = await supabaseAdmin
      .from("sub_categories")
      .delete()
      .eq("category_id", id);
    if (subCategoryError) throw subCategoryError;

    // 2. Delete all menu items linked to this category
    const { error: menuItemError } = await supabaseAdmin
      .from("menu_items")
      .delete()
      .eq("category_id", id);
    if (menuItemError) throw menuItemError;

    // 3. Finally, delete the main category
    const { error: categoryError } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);
    if (categoryError) throw categoryError;

    // Commit the transaction
    await supabaseAdmin.rpc("pg_commit");

    return res.status(204).send();
  } catch (err: any) {
    // Rollback the transaction on error
    await supabaseAdmin.rpc("pg_rollback");
    console.error("Error deleting menu category:", err.message);
    return res.status(500).json({ error: "Failed to delete menu category." });
  }
};
