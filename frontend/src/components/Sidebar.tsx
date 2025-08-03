// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../services/auth";
// import { useMediaQuery } from "../hooks/useMediaQuery";

// interface SidebarProps {
//   toggleSidebar: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
//   const { profile } = useAuth();
//   const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
//     useState(false);

//   const isAdmin = profile?.role?.name === "admin";
//   const isManager = profile?.role?.name === "manager";
//   const canManageUsers = isAdmin || isManager;

//   // Use the custom hook to check if the screen is small (less than 768px)
//   const isSmallScreen = useMediaQuery("(max-width: 767px)");

//   const handleLinkClick = () => {
//     // Only close the sidebar if it's a small screen
//     if (isSmallScreen) {
//       toggleSidebar();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col p-4 text-white bg-gray-800">
//       {/* Sidebar Header/Logo - The close button is now always visible */}
//       <div className="flex justify-between items-center mb-6">
//         <Link
//           to="/dashboard"
//           className="text-xl font-bold"
//           onClick={handleLinkClick}
//         >
//           Arctic Dessert
//         </Link>
//         <button
//           onClick={toggleSidebar}
//           className="text-white hover:text-gray-300"
//           aria-label="Close Sidebar"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>

//       <nav className="flex-grow">
//         <ul className="space-y-2">
//           {/* Dashboard Link */}
//           <li>
//             <Link
//               to="/dashboard"
//               className="block p-2 rounded-md hover:bg-gray-700"
//               onClick={handleLinkClick}
//             >
//               Dashboard
//             </Link>
//           </li>

//           {/* User Management Link (conditional) */}
//           {canManageUsers && (
//             <li>
//               <Link
//                 to="/user-management"
//                 className="block p-2 rounded-md hover:bg-gray-700"
//                 onClick={handleLinkClick}
//               >
//                 User Management
//               </Link>
//             </li>
//           )}

//           {/* Management Dropdown Menu */}
//           <li>
//             <div
//               onClick={() =>
//                 setIsManagementDropdownOpen(!isManagementDropdownOpen)
//               }
//               className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") {
//                   setIsManagementDropdownOpen(!isManagementDropdownOpen);
//                 }
//               }}
//               aria-expanded={isManagementDropdownOpen}
//               aria-controls="management-submenu"
//               role="button"
//             >
//               <span>Restaurant Management</span>
//               <svg
//                 className={`w-4 h-4 transform transition-transform ${
//                   isManagementDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             {isManagementDropdownOpen && (
//               <ul
//                 className="ml-4 mt-1 space-y-1"
//                 id="management-submenu"
//                 role="region"
//               >
//                 <li>
//                   <Link
//                     to="/menu-categories"
//                     className="block p-2 rounded-md hover:bg-gray-700"
//                     onClick={handleLinkClick}
//                   >
//                     Menu Categories
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/ingredient-categories"
//                     className="block p-2 rounded-md hover:bg-gray-700"
//                     onClick={handleLinkClick}
//                   >
//                     Ingredient Categories
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../services/auth";
// import { useMediaQuery } from "../hooks/useMediaQuery";

// interface SidebarProps {
//   toggleSidebar: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
//   const { profile } = useAuth();
//   const location = useLocation();

//   // State for the new dropdown menus
//   const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
//   const [isIngredientsDropdownOpen, setIsIngredientsDropdownOpen] =
//     useState(false);

//   const isAdmin = profile?.role?.name === "admin";
//   const isManager = profile?.role?.name === "manager";
//   const canManageUsers = isAdmin || isManager;

//   const isSmallScreen = useMediaQuery("(max-width: 767px)");

//   const handleLinkClick = () => {
//     // Only close the sidebar if it's a small screen
//     if (isSmallScreen) {
//       toggleSidebar();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col p-4 text-white bg-gray-800">
//       <div className="flex justify-between items-center mb-6">
//         <Link
//           to="/dashboard"
//           className="text-xl font-bold"
//           onClick={handleLinkClick}
//         >
//           Arctic Dessert
//         </Link>
//         <button
//           onClick={toggleSidebar}
//           className="text-white hover:text-gray-300"
//           aria-label="Close Sidebar"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>
//       </div>

//       <nav className="flex-grow">
//         <ul className="space-y-2">
//           {/* Dashboard Link */}
//           <li>
//             <Link
//               to="/dashboard"
//               className={`block p-2 rounded-md hover:bg-gray-700 ${
//                 location.pathname === "/dashboard" ? "bg-gray-700" : ""
//               }`}
//               onClick={handleLinkClick}
//             >
//               Dashboard
//             </Link>
//           </li>

//           {/* User Management Link (conditional) */}
//           {canManageUsers && (
//             <li>
//               <Link
//                 to="/user-management"
//                 className={`block p-2 rounded-md hover:bg-gray-700 ${
//                   location.pathname === "/user-management" ? "bg-gray-700" : ""
//                 }`}
//                 onClick={handleLinkClick}
//               >
//                 User Management
//               </Link>
//             </li>
//           )}

//           {/* Menu Dropdown */}
//           <li>
//             <div
//               onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
//               className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
//             >
//               <span>Menu</span>
//               <svg
//                 className={`w-4 h-4 transform transition-transform ${
//                   isMenuDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             {isMenuDropdownOpen && (
//               <ul className="ml-4 mt-1 space-y-1">
//                 <li>
//                   <Link
//                     to="/menu"
//                     className={`block p-2 rounded-md hover:bg-gray-700 ${
//                       location.pathname.startsWith("/menu") &&
//                       !location.pathname.includes("/menu-categories")
//                         ? "bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={handleLinkClick}
//                   >
//                     Menu Items
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/menu-categories"
//                     className={`block p-2 rounded-md hover:bg-gray-700 ${
//                       location.pathname.startsWith("/menu-categories")
//                         ? "bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={handleLinkClick}
//                   >
//                     Menu Categories
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Ingredients Dropdown */}
//           <li>
//             <div
//               onClick={() =>
//                 setIsIngredientsDropdownOpen(!isIngredientsDropdownOpen)
//               }
//               className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
//             >
//               <span>Ingredients</span>
//               <svg
//                 className={`w-4 h-4 transform transition-transform ${
//                   isIngredientsDropdownOpen ? "rotate-180" : ""
//                 }`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             {isIngredientsDropdownOpen && (
//               <ul className="ml-4 mt-1 space-y-1">
//                 <li>
//                   <Link
//                     to="/ingredients"
//                     className={`block p-2 rounded-md hover:bg-gray-700 ${
//                       location.pathname.startsWith("/ingredients") &&
//                       !location.pathname.includes("/ingredient-categories")
//                         ? "bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={handleLinkClick}
//                   >
//                     Ingredients
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/ingredient-categories"
//                     className={`block p-2 rounded-md hover:bg-gray-700 ${
//                       location.pathname.startsWith("/ingredient-categories")
//                         ? "bg-gray-700"
//                         : ""
//                     }`}
//                     onClick={handleLinkClick}
//                   >
//                     Ingredient Categories
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../services/auth";
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const { profile } = useAuth();
  const location = useLocation();

  console.log("Current user profile:", profile);

  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);

  // The conditional check for canManageUsers is no longer needed to render the link.
  const isSmallScreen = window.innerWidth < 768;

  const handleLinkClick = () => {
    if (isSmallScreen) {
      toggleSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 text-white bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/dashboard"
          className="text-xl font-bold"
          onClick={handleLinkClick}
        >
          Arctic Dessert
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300 md:hidden" // Hide on larger screens
          aria-label="Close Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {/* Dashboard Link */}
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded-md hover:bg-gray-700 ${
                location.pathname === "/dashboard" ? "bg-gray-700" : ""
              }`}
              onClick={handleLinkClick}
            >
              <HomeIcon className="w-6 h-6 mr-3" />
              Dashboard
            </Link>
          </li>

          {/* User Management Link is now always rendered */}
          <li>
            <Link
              to="/users"
              className={`flex items-center p-2 rounded-md hover:bg-gray-700 ${
                location.pathname === "/users" ? "bg-gray-700" : ""
              }`}
              onClick={handleLinkClick}
            >
              <UsersIcon className="w-6 h-6 mr-3" />
              User Management
            </Link>
          </li>

          {/* Inventory Dropdown */}
          <li>
            <div
              onClick={() =>
                setIsInventoryDropdownOpen(!isInventoryDropdownOpen)
              }
              className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-3" />
                <span>Inventory</span>
              </div>
              {isInventoryDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </div>
            {isInventoryDropdownOpen && (
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/menu"
                    className={`block p-2 rounded-md hover:bg-gray-700 ${
                      location.pathname.startsWith("/menu") &&
                      !location.pathname.includes("/menu-categories")
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Menu Items
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ingredients"
                    className={`block p-2 rounded-md hover:bg-gray-700 ${
                      location.pathname.startsWith("/ingredients") &&
                      !location.pathname.includes("/ingredient-categories")
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Ingredients
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Categories Dropdown */}
          <li>
            <div
              onClick={() =>
                setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
              }
              className="flex justify-between items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex items-center">
                <DocumentDuplicateIcon className="w-6 h-6 mr-3" />
                <span>Categories</span>
              </div>
              {isCategoriesDropdownOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </div>
            {isCategoriesDropdownOpen && (
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/menu-categories"
                    className={`block p-2 rounded-md hover:bg-gray-700 ${
                      location.pathname.startsWith("/menu-categories")
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Menu Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ingredient-categories"
                    className={`block p-2 rounded-md hover:bg-gray-700 ${
                      location.pathname.startsWith("/ingredient-categories")
                        ? "bg-gray-700"
                        : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    Ingredient Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
