// backend/src/routes/menuRoutes.ts

const { Router } = require("express");
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all menu items (public route)
router.get("/", getAllMenuItems);
// GET a single menu item by ID (public route)
router.get("/:id", getMenuItemById);

// The following routes require authentication and admin role
router.post("/", requireAuth, requireAdmin, createMenuItem);
router.put("/:id", requireAuth, requireAdmin, updateMenuItem);
router.delete("/:id", requireAuth, requireAdmin, deleteMenuItem);

// Use 'module.exports' to export the router instance
module.exports = router;
