// backend/src/routes/subCategoryRoutes.ts

const { Router } = require("express");
import {
  getAllSubCategories,
  getSubCategoriesByCategoryId,
} from "../controllers/subCategoryController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all sub-categories
router.get("/", getAllSubCategories);

// GET sub-categories by category ID (add protection if needed)
router.get("/category/:categoryId", getSubCategoriesByCategoryId);

// Use 'module.exports' to export the router instance
module.exports = router;
