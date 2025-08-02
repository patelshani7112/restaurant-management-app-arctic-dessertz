// backend/src/routes/categoryRoutes.ts
const { Router } = require("express");
import { getAllCategories } from "../controllers/categoryController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all categories (now requires authentication and admin role)
router.get("/", requireAuth, requireAdmin, getAllCategories);

// This line is essential
module.exports = router;
