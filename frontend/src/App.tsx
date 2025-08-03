// // frontend/src/App.tsx
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./components/ProtectedRoute.tsx";

// // Import your pages
// import HomePage from "./pages/HomePage.tsx";
// import AdminDashboard from "./pages/AdminDashboard.tsx";
// import LoginPage from "./pages/LoginPage.tsx";
// import MenuPage from "./pages/MenuPage.tsx";
// import AddMenuItemPage from "./pages/AddMenuItemPage.tsx";
// import EditMenuItemPage from "./pages/EditMenuItemPage.tsx";
// import IngredientsPage from "./pages/IngredientsPage.tsx";
// import AddIngredientPage from "./pages/AddIngredientPage.tsx";
// import EditIngredientPage from "./pages/EditIngredientPage.tsx";

// // New imports for category pages
// import MenuCategoriesPage from "./pages/MenuCategoriesPage.tsx";
// import AddMenuCategoryPage from "./pages/AddMenuCategoryPage.tsx";
// import EditMenuCategoryPage from "./pages/EditMenuCategoryPage.tsx";
// import IngredientCategoriesPage from "./pages/IngredientCategoriesPage.tsx";
// import AddIngredientCategoryPage from "./pages/AddIngredientCategoryPage.tsx";
// import EditIngredientCategoryPage from "./pages/EditIngredientCategoryPage.tsx";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route index element={<HomePage />} />
//         <Route path="login" element={<LoginPage />} />
//         <Route
//           path="dashboard"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="menu" element={<MenuPage />} />
//         <Route
//           path="menu/add"
//           element={
//             <ProtectedRoute>
//               <AddMenuItemPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="menu/edit/:id"
//           element={
//             <ProtectedRoute>
//               <EditMenuItemPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="ingredients" element={<IngredientsPage />} />
//         <Route
//           path="ingredients/add"
//           element={
//             <ProtectedRoute>
//               <AddIngredientPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="ingredients/edit/:id"
//           element={
//             <ProtectedRoute>
//               <EditIngredientPage />
//             </ProtectedRoute>
//           }
//         />
//         {/* New Routes for Menu Categories */}
//         <Route
//           path="menu-categories"
//           element={
//             <ProtectedRoute>
//               <MenuCategoriesPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="menu-categories/add"
//           element={
//             <ProtectedRoute>
//               <AddMenuCategoryPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="menu-categories/edit/:id"
//           element={
//             <ProtectedRoute>
//               <EditMenuCategoryPage />
//             </ProtectedRoute>
//           }
//         />
//         {/* New Routes for Ingredient Categories */}
//         <Route
//           path="ingredient-categories"
//           element={
//             <ProtectedRoute>
//               <IngredientCategoriesPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="ingredient-categories/add"
//           element={
//             <ProtectedRoute>
//               <AddIngredientCategoryPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="ingredient-categories/edit/:id"
//           element={
//             <ProtectedRoute>
//               <EditIngredientCategoryPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<div>404 Page Not Found</div>} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Layout from "./components/Layout";
// import DashboardLayout from "./components/DashboardLayout";
// import { useAuth } from "./services/auth";

// // Import your pages
// import HomePage from "./pages/HomePage";
// import AdminDashboard from "./pages/AdminDashboard";
// import LoginPage from "./pages/LoginPage";
// import MenuPage from "./pages/MenuPage";
// import AddMenuItemPage from "./pages/AddMenuItemPage";
// import EditMenuItemPage from "./pages/EditMenuItemPage";
// import IngredientsPage from "./pages/IngredientsPage";
// import AddIngredientPage from "./pages/AddIngredientPage";
// import EditIngredientPage from "./pages/EditIngredientPage";
// import MenuCategoriesPage from "./pages/MenuCategoriesPage";
// import AddMenuCategoryPage from "./pages/AddMenuCategoryPage";
// import EditMenuCategoryPage from "./pages/EditMenuCategoryPage";
// import IngredientCategoriesPage from "./pages/IngredientCategoriesPage";
// import AddIngredientCategoryPage from "./pages/AddIngredientCategoryPage";
// import EditIngredientCategoryPage from "./pages/EditIngredientCategoryPage";

// // A component to protect routes
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };

// function App() {
//   return (
//     <Routes>
//       {/* Public Routes: These routes do not require authentication */}
//       <Route path="/" element={<Layout />}>
//         <Route index element={<HomePage />} />
//         <Route path="login" element={<LoginPage />} />
//       </Route>

//       {/* Protected Routes: These routes require authentication and use the DashboardLayout */}
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="dashboard" element={<AdminDashboard />} />

//         {/*
//           TEMPORARILY REMOVED: These pages do not exist yet.
//           We will add them back once you create the files.
//         */}
//         <Route
//           path="user-management"
//           element={<div>User Management Page Coming Soon...</div>}
//         />
//         <Route
//           path="profile"
//           element={<div>My Profile Page Coming Soon...</div>}
//         />

//         {/* Menu & Ingredient Items */}
//         <Route path="menu" element={<MenuPage />} />
//         <Route path="menu/add" element={<AddMenuItemPage />} />
//         <Route path="menu/edit/:id" element={<EditMenuItemPage />} />
//         <Route path="ingredients" element={<IngredientsPage />} />
//         <Route path="ingredients/add" element={<AddIngredientPage />} />
//         <Route path="ingredients/edit/:id" element={<EditIngredientPage />} />

//         {/* Categories */}
//         <Route path="menu-categories" element={<MenuCategoriesPage />} />
//         <Route path="menu-categories/add" element={<AddMenuCategoryPage />} />
//         <Route
//           path="menu-categories/edit/:id"
//           element={<EditMenuCategoryPage />}
//         />
//         <Route
//           path="ingredient-categories"
//           element={<IngredientCategoriesPage />}
//         />
//         <Route
//           path="ingredient-categories/add"
//           element={<AddIngredientCategoryPage />}
//         />
//         <Route
//           path="ingredient-categories/edit/:id"
//           element={<EditIngredientCategoryPage />}
//         />
//       </Route>

//       {/* Fallback route for 404 Not Found */}
//       <Route path="*" element={<div>404 Page Not Found</div>} />
//     </Routes>
//   );
// }

// export default App;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { useAuth } from "./services/auth";

// Import all your pages
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import AddMenuItemPage from "./pages/AddMenuItemPage";
import EditMenuItemPage from "./pages/EditMenuItemPage";
import IngredientsPage from "./pages/IngredientsPage";
import AddIngredientPage from "./pages/AddIngredientPage";
import EditIngredientPage from "./pages/EditIngredientPage";
import MenuCategoriesPage from "./pages/MenuCategoriesPage";
import AddMenuCategoryPage from "./pages/AddMenuCategoryPage";
import EditMenuCategoryPage from "./pages/EditMenuCategoryPage";
import IngredientCategoriesPage from "./pages/IngredientCategoriesPage";
import AddIngredientCategoryPage from "./pages/AddIngredientCategoryPage";
import EditIngredientCategoryPage from "./pages/EditIngredientCategoryPage";

// A component to protect routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes: These routes do not require authentication */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Protected Routes: These routes require authentication and use the DashboardLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Temporary placeholder pages */}
        <Route
          path="user-management"
          element={<div>User Management Page Coming Soon...</div>}
        />
        <Route
          path="profile"
          element={<div>My Profile Page Coming Soon...</div>}
        />

        {/* Menu & Ingredient Items */}
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/add" element={<AddMenuItemPage />} />
        <Route path="menu/edit/:id" element={<EditMenuItemPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route path="ingredients/add" element={<AddIngredientPage />} />
        <Route path="ingredients/edit/:id" element={<EditIngredientPage />} />

        {/* Categories */}
        <Route path="menu-categories" element={<MenuCategoriesPage />} />
        <Route path="menu-categories/add" element={<AddMenuCategoryPage />} />
        <Route
          path="menu-categories/edit/:id"
          element={<EditMenuCategoryPage />}
        />
        <Route
          path="ingredient-categories"
          element={<IngredientCategoriesPage />}
        />
        <Route
          path="ingredient-categories/add"
          element={<AddIngredientCategoryPage />}
        />
        <Route
          path="ingredient-categories/edit/:id"
          element={<EditIngredientCategoryPage />}
        />
      </Route>

      {/* Fallback route for 404 Not Found */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

export default App;
