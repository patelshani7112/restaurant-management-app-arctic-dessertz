// backend/src/routes/ingredientCategoryRoutes.ts
const { Router } = require("express");
import {
  getAllIngredientCategories,
  createIngredientCategory,
  getIngredientCategoryById, // ADDED: Import the new controller function
  updateIngredientCategory,
  deleteIngredientCategory,
} from "../controllers/ingredientCategoryController";

const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// This route handles GET (all) and POST (create new)
router
  .route("/")
  .get(requireAuth, requireAdmin, getAllIngredientCategories)
  .post(requireAuth, requireAdmin, createIngredientCategory);

// This route now handles GET, PUT, and DELETE for a specific ID
router
  .route("/:id")
  .get(requireAuth, requireAdmin, getIngredientCategoryById) // ADDED: The missing GET route
  .put(requireAuth, requireAdmin, updateIngredientCategory)
  .delete(requireAuth, requireAdmin, deleteIngredientCategory);

module.exports = router;
