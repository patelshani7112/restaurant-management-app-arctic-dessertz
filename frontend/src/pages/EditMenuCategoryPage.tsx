// frontend/src/pages/EditMenuCategoryPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient.ts";

interface MenuCategory {
  id: string;
  name: string;
}

const EditMenuCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError("Category ID is missing.");
        setLoading(false);
        return;
      }
      try {
        const response = await apiClient.get<MenuCategory>(
          `/menu-categories/${id}`
        );
        setName(response.data.name);
        setError(null);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to fetch category data. Please check the URL.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!id) return;
      await apiClient.put(`/menu-categories/${id}`, { name });
      navigate("/menu-categories");
    } catch (err) {
      console.error("Error updating menu category:", err);
      setError("Failed to update the category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading category data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-lg text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Edit Menu Category
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu-categories")}
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuCategoryPage;
