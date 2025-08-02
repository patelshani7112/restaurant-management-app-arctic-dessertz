// backend/src/routes/menuCategoryRoutes.ts
const { Router } = require("express");
import {
  getAllMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  getMenuCategory, // Add this line to import the controller function
} from "../controllers/menuCategoryController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// This route handles GET (all) and POST (create new)
router
  .route("/")
  .get(requireAuth, requireAdmin, getAllMenuCategories)
  .post(requireAuth, requireAdmin, createMenuCategory);

// This route now handles GET, PUT, and DELETE for a specific item
router
  .route("/:id")
  .get(requireAuth, requireAdmin, getMenuCategory) // ADDED: This handles the GET request for a single category
  .put(requireAuth, requireAdmin, updateMenuCategory)
  .delete(requireAuth, requireAdmin, deleteMenuCategory);

module.exports = router;
