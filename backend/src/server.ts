// backend/src/server.ts
import { Request, Response } from "express"; // Import types only

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Use 'require' for all your local route modules
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const ingredientCategoryRoutes = require("./routes/ingredientCategoryRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main route with explicit type annotations for 'req' and 'res'
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Backend server is running!" });
});

// Use 'app.use' for all your routes
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/ingredient-categories", ingredientCategoryRoutes);
app.use("/api/ingredients", ingredientRoutes);

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
