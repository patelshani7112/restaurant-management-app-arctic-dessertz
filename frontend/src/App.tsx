// frontend/src/App.tsx
import React from "react";
// Remove BrowserRouter and AuthProvider from this import line. They belong in main.tsx.
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

function App() {
  return (
    // The App component should only contain your routes.
    // The AuthProvider and BrowserRouter are handled in main.tsx.
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
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
