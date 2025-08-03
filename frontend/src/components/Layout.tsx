// // frontend/src/components/Layout.tsx
// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../services/auth.tsx";
// import { supabase } from "../supabaseClient.ts";

// function Layout() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error logging out:", error.message);
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <header className="bg-white shadow-md p-4">
//         <nav className="container mx-auto flex justify-between items-center">
//           <Link to="/" className="text-xl font-bold text-gray-800">
//             Arctic Dessert Management
//           </Link>
//           <div className="space-x-4 flex items-center">
//             {user ? (
//               <>
//                 <Link
//                   to="/dashboard"
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   Dashboard
//                 </Link>
//                 {/* New links for category management */}
//                 <Link
//                   to="/menu-categories"
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   Menu Categories
//                 </Link>
//                 <Link
//                   to="/ingredient-categories"
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   Ingredient Categories
//                 </Link>
//                 <Link to="/menu" className="text-gray-600 hover:text-gray-800">
//                   Menu Items
//                 </Link>
//                 <Link
//                   to="/ingredients"
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   Ingredients
//                 </Link>
//                 <span className="text-gray-600">Hello, {user.email}</span>
//                 <button
//                   onClick={handleLogout}
//                   className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link
//                 to="/login"
//                 className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </nav>
//       </header>
//       <main className="container mx-auto p-8 flex-grow">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default Layout;

import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/*
        The header has been removed from this component.
        Public pages (like Home and Login) will now have a blank top section.
        Authenticated pages will use DashboardLayout and its header.
      */}
      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
