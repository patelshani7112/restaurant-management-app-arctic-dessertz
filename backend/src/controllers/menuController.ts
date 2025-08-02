// backend/src/controllers/menuController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Helper function to transform fetched data
const transformMenuItemData = (item: any) => {
  if (!item) return null;

  return {
    ...item,
    category_name: item.categories?.name || "Uncategorized",
    sub_category_name: item.sub_categories?.name || null,
    ingredients: item.menu_item_ingredients.map((mii: any) => ({
      id: mii.ingredients.id,
      name: mii.ingredients.name,
      // Use the new explicit relationship name to access the category name
      category_name:
        mii.ingredients["ingredient_categories!fk_category"]?.name || "N/A",
    })),
    // Remove the raw nested objects to clean up the response
    categories: undefined,
    sub_categories: undefined,
    menu_item_ingredients: undefined,
  };
};

// GET all menu items
export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .select(
        `
        *,
        categories (name),
        sub_categories (name),
        menu_item_ingredients (
          ingredients (
            id,
            name,
            ingredient_categories!fk_category (name)
          )
        )
      `
      )
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching all menu items:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "No menu items found" });
    }

    const menuItems = data.map(transformMenuItemData);
    res.status(200).json(menuItems);
  } catch (err: any) {
    console.error("Unexpected error in getAllMenuItems:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET a single menu item by ID
export const getMenuItemById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_items")
      .select(
        `
        *,
        categories (name),
        sub_categories (name),
        menu_item_ingredients (
          ingredients (
            id,
            name,
            ingredient_categories!fk_category (name)
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res
          .status(404)
          .json({ error: `Menu item with ID ${id} not found` });
      }
      console.error(`Error fetching menu item with ID ${id}:`, error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: `Menu item with ID ${id} not found` });
    }

    const menuItem = transformMenuItemData(data);
    res.status(200).json(menuItem);
  } catch (err: any) {
    console.error(`Unexpected error in getMenuItemById with ID ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CREATE a new menu item
export const createMenuItem = async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    category_id,
    sub_category_id,
    image_url,
    is_active,
    video_url,
    making_process,
    ingredient_ids,
  } = req.body;

  try {
    const { data: menuItemData, error: menuItemError } = await supabaseAdmin
      .from("menu_items")
      .insert({
        name,
        description,
        price,
        category_id,
        sub_category_id,
        image_url,
        is_active,
        video_url,
        making_process,
      })
      .select()
      .single();

    if (menuItemError) {
      console.error("Error creating menu item:", menuItemError);
      return res.status(500).json({ error: menuItemError.message });
    }

    if (ingredient_ids && ingredient_ids.length > 0) {
      const menuItemId = menuItemData.id;
      const ingredientsToInsert = ingredient_ids.map(
        (ingredientId: string) => ({
          menu_item_id: menuItemId,
          ingredient_id: ingredientId,
        })
      );

      const { error: joinError } = await supabaseAdmin
        .from("menu_item_ingredients")
        .insert(ingredientsToInsert);

      if (joinError) {
        console.error("Error inserting menu item ingredients:", joinError);
        await supabaseAdmin.from("menu_items").delete().eq("id", menuItemId);
        return res.status(500).json({
          error:
            "Failed to link ingredients to menu item: " + joinError.message,
        });
      }
    }

    res.status(201).json({
      message: "Menu item created successfully!",
      menuItem: menuItemData,
    });
  } catch (err: any) {
    console.error("Unexpected error in createMenuItem:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE a menu item by ID
export const updateMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category_id,
    sub_category_id,
    image_url,
    is_active,
    video_url,
    making_process,
    ingredient_ids,
  } = req.body;

  try {
    const { data: updatedMenuItem, error: menuItemError } = await supabaseAdmin
      .from("menu_items")
      .update({
        name,
        description,
        price,
        category_id,
        sub_category_id,
        image_url,
        is_active,
        video_url,
        making_process,
      })
      .eq("id", id)
      .select()
      .single();

    if (menuItemError) {
      if (menuItemError.code === "PGRST116") {
        return res
          .status(404)
          .json({ error: `Menu item with ID ${id} not found` });
      }
      console.error(`Error updating menu item with ID ${id}:`, menuItemError);
      return res.status(500).json({ error: menuItemError.message });
    }

    if (!updatedMenuItem) {
      return res
        .status(404)
        .json({ error: `Menu item with ID ${id} not found for update.` });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("menu_item_ingredients")
      .delete()
      .eq("menu_item_id", id);

    if (deleteError) {
      console.error(
        "Error deleting old ingredients for menu item:",
        deleteError
      );
      return res.status(500).json({
        error: "Failed to update menu item ingredients: " + deleteError.message,
      });
    }

    if (ingredient_ids && ingredient_ids.length > 0) {
      const ingredientsToInsert = ingredient_ids.map(
        (ingredientId: string) => ({
          menu_item_id: id,
          ingredient_id: ingredientId,
        })
      );

      const { error: insertError } = await supabaseAdmin
        .from("menu_item_ingredients")
        .insert(ingredientsToInsert);

      if (insertError) {
        console.error(
          "Error inserting new ingredients for menu item:",
          insertError
        );
        return res.status(500).json({
          error:
            "Failed to link new ingredients to menu item: " +
            insertError.message,
        });
      }
    }

    res.status(200).json({
      message: "Menu item updated successfully!",
      menuItem: updatedMenuItem,
    });
  } catch (err: any) {
    console.error(`Unexpected error in updateMenuItem with ID ${id}:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE a menu item by ID
export const deleteMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error: deleteIngredientsError } = await supabaseAdmin
      .from("menu_item_ingredients")
      .delete()
      .eq("menu_item_id", id);

    if (deleteIngredientsError) {
      throw new Error(deleteIngredientsError.message);
    }

    const { error: deleteItemError } = await supabaseAdmin
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (deleteItemError) {
      throw new Error(deleteItemError.message);
    }

    res.status(200).json({ message: "Menu item deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: error.message });
  }
};
