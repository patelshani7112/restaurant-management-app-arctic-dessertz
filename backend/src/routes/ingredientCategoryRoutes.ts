// // backend/src/routes/ingredientCategoryRoutes.ts

// import { Router } from "express";

// import { getAllIngredientCategories } from "../controllers/ingredientCategoryController";

// // Use 'require' for all middleware and omit the '.ts' file extension

// const { requireAuth } = require("../middlewares/authMiddleware");

// const { requireAdmin } = require("../middlewares/roleMiddleware");

// const router = Router();

// // GET all ingredient categories (requires authentication)

// router.get("/", requireAuth, getAllIngredientCategories);

// // Use 'module.exports' to export the router instance

// module.exports = router;

// backend/src/routes/ingredientCategoryRoutes.ts

import { Router } from "express";
import {
  getAllIngredientCategories,
  createIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
} from "../controllers/ingredientCategoryController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all ingredient categories (Read)
// Endpoint: GET /api/ingredient-categories
router.get("/", requireAuth, getAllIngredientCategories);

// POST create a new ingredient category (Create)
// Endpoint: POST /api/ingredient-categories
router.post("/", requireAuth, requireAdmin, createIngredientCategory);

// PUT update an ingredient category by ID (Update)
// Endpoint: PUT /api/ingredient-categories/:id
router.put("/:id", requireAuth, requireAdmin, updateIngredientCategory);

// DELETE an ingredient category by ID (Delete)
// Endpoint: DELETE /api/ingredient-categories/:id
router.delete("/:id", requireAuth, requireAdmin, deleteIngredientCategory);

// Use 'module.exports' to export the router instance
module.exports = router;
