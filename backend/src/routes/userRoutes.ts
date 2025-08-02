// backend/src/routes/userRoutes.ts
const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getAdminCount,
} = require("../controllers/userController");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/roleMiddleware");

const router = Router();

router.get("/", requireAuth, requireAdmin, getAllUsers);
router.post("/", requireAuth, requireAdmin, createUser);
router.patch("/:id", requireAuth, requireAdmin, updateUser);
router.delete("/:id", requireAuth, requireAdmin, deleteUser);
router.get("/admin-count", requireAuth, requireAdmin, getAdminCount);

module.exports = router;
