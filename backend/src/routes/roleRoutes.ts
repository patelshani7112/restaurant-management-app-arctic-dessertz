// backend/src/routes/roleRoutes.ts
// Change to require
const { Router } = require("express");

import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all roles
router.get("/", requireAuth, requireAdmin, getAllRoles);
// GET a single role by ID
router.get("/:id", requireAuth, requireAdmin, getRoleById);
// POST a new role
router.post("/", requireAuth, requireAdmin, createRole);
// PATCH to update a role by ID
router.patch("/:id", requireAuth, requireAdmin, updateRole);
// DELETE a role by ID
router.delete("/:id", requireAuth, requireAdmin, deleteRole);

// Use 'module.exports' to export the router instance
module.exports = router;
