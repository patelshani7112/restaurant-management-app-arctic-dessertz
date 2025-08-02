// backend/src/routes/departmentRoutes.ts

const { Router } = require("express");
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all departments
router.get("/", requireAuth, requireAdmin, getAllDepartments);
// GET a single department by ID
router.get("/:id", requireAuth, requireAdmin, getDepartmentById);
// POST a new department
router.post("/", requireAuth, requireAdmin, createDepartment);
// PATCH to update a department by ID
router.patch("/:id", requireAuth, requireAdmin, updateDepartment);
// DELETE a department by ID
router.delete("/:id", requireAuth, requireAdmin, deleteDepartment);

// Use 'module.exports' to export the router instance
module.exports = router;
