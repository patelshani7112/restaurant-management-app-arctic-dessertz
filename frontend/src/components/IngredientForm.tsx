// frontend/src/components/IngredientForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ADDED: Import Supabase client
import { supabase } from "../supabaseClient";

interface Category {
  id: string;
  name: string;
}

interface IngredientFormData {
  name: string;
  category_id: string;
}

interface IngredientFormProps {
  initialData?: IngredientFormData & { id?: string }; // Added id for edit mode
  isEditMode?: boolean;
}

function IngredientForm({
  initialData,
  isEditMode = false,
}: IngredientFormProps) {
  const [formData, setFormData] = useState<IngredientFormData>(
    initialData || { name: "", category_id: "" }
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // FIX 1: Add Authorization to the category fetch call
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error(sessionError?.message || "User not authenticated.");
        }

        const response = await fetch(
          "http://localhost:3000/api/ingredient-categories",
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // FIX 2: Add Authorization to the form submission fetch call
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error(sessionError?.message || "User not authenticated.");
      }

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:3000/api/ingredients/${initialData?.id}`
        : "http://localhost:3000/api/ingredients";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      await response.json();
      navigate("/ingredients");
    } catch (err: any) {
      console.error("Failed to save ingredient:", err);
      setError(err.message || "Failed to save ingredient.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading categories...
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

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Edit Ingredient" : "Add New Ingredient"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Ingredient Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="category_id"
              className="block text-gray-700 font-bold mb-2"
            >
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select a Category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            {isEditMode ? "Update Ingredient" : "Add Ingredient"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default IngredientForm;
