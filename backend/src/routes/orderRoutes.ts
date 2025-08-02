// backend/src/routes/orderRoutes.ts

const { Router } = require("express");
import {
  getAllOrders,
  getOrderById,
  createOrder,
} from "../controllers/orderController";

// Use 'require' for all middleware and omit the '.ts' file extension
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

// GET all orders (requires authentication)
router.get("/", requireAuth, getAllOrders);
// GET a single order by ID (requires authentication)
router.get("/:id", requireAuth, getOrderById);
// POST a new order (this might be a public route for a customer, but we'll add admin protection for now)
router.post("/", requireAuth, requireAdmin, createOrder);

// Use 'module.exports' to export the router instance
module.exports = router;
