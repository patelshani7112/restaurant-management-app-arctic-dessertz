// frontend/src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

// Import your pages
import HomePage from "./pages/HomePage.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MenuPage from "./pages/MenuPage.tsx";
import AddMenuItemPage from "./pages/AddMenuItemPage.tsx";
import EditMenuItemPage from "./pages/EditMenuItemPage.tsx";
import IngredientsPage from "./pages/IngredientsPage.tsx";
import AddIngredientPage from "./pages/AddIngredientPage.tsx";
import EditIngredientPage from "./pages/EditIngredientPage.tsx";

// New imports for category pages
import MenuCategoriesPage from "./pages/MenuCategoriesPage.tsx";
import AddMenuCategoryPage from "./pages/AddMenuCategoryPage.tsx";
import EditMenuCategoryPage from "./pages/EditMenuCategoryPage.tsx";
import IngredientCategoriesPage from "./pages/IngredientCategoriesPage.tsx";
import AddIngredientCategoryPage from "./pages/AddIngredientCategoryPage.tsx";
import EditIngredientCategoryPage from "./pages/EditIngredientCategoryPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="menu" element={<MenuPage />} />
        <Route
          path="menu/add"
          element={
            <ProtectedRoute>
              <AddMenuItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="menu/edit/:id"
          element={
            <ProtectedRoute>
              <EditMenuItemPage />
            </ProtectedRoute>
          }
        />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route
          path="ingredients/add"
          element={
            <ProtectedRoute>
              <AddIngredientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ingredients/edit/:id"
          element={
            <ProtectedRoute>
              <EditIngredientPage />
            </ProtectedRoute>
          }
        />
        {/* New Routes for Menu Categories */}
        <Route
          path="menu-categories"
          element={
            <ProtectedRoute>
              <MenuCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="menu-categories/add"
          element={
            <ProtectedRoute>
              <AddMenuCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="menu-categories/edit/:id"
          element={
            <ProtectedRoute>
              <EditMenuCategoryPage />
            </ProtectedRoute>
          }
        />
        {/* New Routes for Ingredient Categories */}
        <Route
          path="ingredient-categories"
          element={
            <ProtectedRoute>
              <IngredientCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ingredient-categories/add"
          element={
            <ProtectedRoute>
              <AddIngredientCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ingredient-categories/edit/:id"
          element={
            <ProtectedRoute>
              <EditIngredientCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
