// backend/src/routes/ingredientRoutes.ts
const { Router } = require("express");
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredientController";
import { getAllIngredientCategories } from "../controllers/ingredientCategoryController"; // <-- 1. ADD THIS IMPORT

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

// 2. DECLARE AND INSTANTIATE THE ROUTER
const router = Router();

// GET all ingredients (requires authentication)
router.get("/", requireAuth, getAllIngredients);
// GET a single ingredient by ID (requires authentication)
router.get("/:id", requireAuth, getIngredientById);
// POST a new ingredient (requires authentication and admin role)
router.post("/", requireAuth, requireAdmin, createIngredient);
// PUT to update an ingredient by ID (requires authentication and admin role)
router.put("/:id", requireAuth, requireAdmin, updateIngredient);
// DELETE an ingredient by ID (requires authentication and admin role)
router.delete("/:id", requireAuth, requireAdmin, deleteIngredient);

// NEW ROUTE TO GET ALL INGREDIENT CATEGORIES
// This should be in its own route file, but we will fix it here for now
router.get("/ingredient-categories", getAllIngredientCategories);
// Use 'module.exports' to export the router instance
module.exports = router;
