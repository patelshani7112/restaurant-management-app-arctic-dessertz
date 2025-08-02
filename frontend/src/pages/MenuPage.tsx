// frontend/src/pages/MenuPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define the Ingredient interface based on the backend's transformed data
interface Ingredient {
  id: string;
  name: string;
  category_name: string; // The ingredient's category name
}

// Update the MenuItem interface to match the backend's response structure
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  video_url: string | null;
  making_process: string | null;
  is_active: boolean;
  category_id: string; // Original category ID
  sub_category_id: string | null; // Original sub_category ID
  category_name: string; // Added: Name of the main category
  sub_category_name: string | null; // Added: Name of the sub-category
  ingredients: Ingredient[]; // Added: Array of associated ingredients
}

function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/menu");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
    } catch (err: any) {
      console.error("Failed to fetch menu items:", err);
      setError("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setMenuItems(menuItems.filter((item) => item.id !== id));
      alert("Menu item deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete menu item:", err);
      alert(`Error deleting menu item: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading menu items...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-6">No menu items found.</p>
        <Link
          to="/menu/add" // Corrected from /menu/new to /menu/add
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Add New Menu Item
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Arctic Desserts Menu
      </h1>

      <div className="flex justify-end mb-6">
        <Link
          to="/menu/add" // Corrected from /menu/new to /menu/add
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300"
        >
          Add New Menu Item
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover object-center border-b border-gray-200"
              />
            )}
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Category:</span>{" "}
                {item.category_name}
                {item.sub_category_name && (
                  <span className="ml-2">/ {item.sub_category_name}</span>
                )}
              </p>
              <p className="text-gray-700 mb-4 text-base line-clamp-3">
                {item.description}
              </p>
              <p className="text-3xl font-extrabold text-green-600 mb-4">
                ${item.price.toFixed(2)}
              </p>

              {/* Display Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Ingredients:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {item.ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="text-sm">
                        {ingredient.name}{" "}
                        <span className="text-gray-500 text-xs">
                          ({ingredient.category_name})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.is_active ? (
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-4">
                  Active
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-4">
                  Inactive
                </span>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <Link
                to={`/menu/edit/${item.id}`}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Edit
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
