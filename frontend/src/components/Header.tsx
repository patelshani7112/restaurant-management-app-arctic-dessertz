import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth";
import { supabase } from "../supabaseClient";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || "";
    const names = name.split(" ");
    return names
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  const userInitials = getInitials(profile?.name || user?.email);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center z-40">
      {/* Left side: Hamburger menu and Company Logo */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Button for all devices */}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Toggle Sidebar"
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
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <Link to="/dashboard" className="text-xl font-bold text-gray-800">
          Arctic Dessert Management
        </Link>
      </div>

      {/* Right side: User Profile with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          aria-haspopup="true"
          aria-expanded={isProfileDropdownOpen}
          aria-label="User menu"
        >
          {userInitials}
        </button>

        {/* Dropdown Menu */}
        {isProfileDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 text-sm text-gray-700">
              Signed in as:{" "}
              <span className="font-semibold block">
                {profile?.name || user?.email}
              </span>
            </div>
            <div className="border-t border-gray-100 my-1"></div>
            <Link
              to="/profile"
              onClick={() => setIsProfileDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsProfileDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
