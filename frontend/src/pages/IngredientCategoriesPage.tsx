// frontend/src/pages/IngredientCategoriesPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient.ts";

interface IngredientCategory {
  id: string;
  name: string;
}

const IngredientCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/ingredient-categories");
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching ingredient categories:", err);
      setError("Failed to fetch ingredient categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this ingredient category?"
      )
    ) {
      try {
        await apiClient.delete(`/ingredient-categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (err) {
        console.error("Error deleting ingredient category:", err);
        setError("Failed to delete the ingredient category. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading ingredient categories...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Ingredient Categories
        </h1>
        <Link
          to="/ingredient-categories/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add New Ingredient Category
        </Link>
      </div>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">
          No ingredient categories found. Add one to get started!
        </p>
      ) : (
        <ul className="space-y-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
            >
              <span className="text-lg font-medium text-gray-800">
                {category.name}
              </span>
              <div className="flex space-x-2">
                <Link
                  to={`/ingredient-categories/edit/${category.id}`}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientCategoriesPage;
