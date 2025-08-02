// frontend/src/components/MenuItemForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ADDED: Import Supabase client
import { supabase } from "../supabaseClient";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
  description: string | null;
}

interface IngredientCategory {
  id: string;
  name: string;
}

interface Ingredient {
  id: string;
  name: string;
  ingredient_category_id: string | null;
  ingredient_categories?: { name: string }; // For joining category name
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  video_url: string | null;
  making_process: string | null;
  is_active: boolean;
  category_id: string;
  sub_category_id: string | null;
  category_name: string;
  sub_category_name: string | null;
  ingredients: Ingredient[];
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  sub_category_id: string | null;
  image_url: string;
  is_active: boolean;
  video_url: string | null;
  making_process: string | null;
  ingredient_ids: string[];
}

interface MenuItemFormProps {
  initialData?: MenuItem;
  onSuccess?: () => void;
}

function MenuItemForm({ initialData, onSuccess }: MenuItemFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MenuItemFormData>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          category_id: initialData.category_id,
          sub_category_id: initialData.sub_category_id,
          image_url: initialData.image_url,
          is_active: initialData.is_active,
          video_url: initialData.video_url,
          making_process: initialData.making_process,
          ingredient_ids: initialData.ingredients.map((ing) => ing.id),
        }
      : {
          name: "",
          description: "",
          price: 0,
          category_id: "",
          sub_category_id: null,
          image_url: "",
          is_active: true,
          video_url: null,
          making_process: null,
          ingredient_ids: [],
        }
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [ingredientCategories, setIngredientCategories] = useState<
    IngredientCategory[]
  >([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );
  const [selectedIngredientCategoryIds, setSelectedIngredientCategoryIds] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [subCategoriesError, setSubCategoriesError] = useState<string | null>(
    null
  );
  const [ingredientDataLoading, setIngredientDataLoading] = useState(true);
  const [ingredientDataError, setIngredientDataError] = useState<string | null>(
    null
  );

  // Effect to fetch main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        // FIX 1: Add Authorization to the categories fetch call
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error(sessionError?.message || "User not authenticated.");
        }

        const response = await fetch(
          "http://localhost:3000/api/menu-categories",
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
        if (!initialData && data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        } else if (!initialData && data.length === 0) {
          setFormData((prev) => ({ ...prev, category_id: "" }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError("Failed to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [initialData]);

  // Effect to fetch sub-categories
  useEffect(() => {
    const fetchSubCategories = async (categoryId: string) => {
      if (!categoryId) {
        setSubCategories([]);
        setFormData((prev) => ({ ...prev, sub_category_id: null }));
        return;
      }
      try {
        setSubCategoriesLoading(true);
        setSubCategoriesError(null);
        // FIX 2: Add Authorization to the sub-categories fetch call
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error(sessionError?.message || "User not authenticated.");
        }

        const response = await fetch(
          `http://localhost:3000/api/sub-categories/category/${categoryId}`,
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
        const data: SubCategory[] = await response.json();
        setSubCategories(data);
        if (
          initialData?.category_id === categoryId &&
          initialData?.sub_category_id &&
          data.some((sub) => sub.id === initialData.sub_category_id)
        ) {
          setFormData((prev) => ({
            ...prev,
            sub_category_id: initialData.sub_category_id,
          }));
        } else if (data.length > 0) {
          setFormData((prev) => ({ ...prev, sub_category_id: data[0].id }));
        } else {
          setFormData((prev) => ({ ...prev, sub_category_id: null }));
        }
      } catch (err) {
        console.error("Failed to fetch sub-categories:", err);
        setSubCategoriesError("Failed to load sub-categories.");
      } finally {
        setSubCategoriesLoading(false);
      }
    };
    if (formData.category_id) {
      fetchSubCategories(formData.category_id);
    } else {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, sub_category_id: null }));
    }
  }, [formData.category_id, initialData]);

  // Effect to fetch ingredient categories and all ingredients
  useEffect(() => {
    const fetchIngredientData = async () => {
      try {
        setIngredientDataLoading(true);
        // FIX 3: Add Authorization to the ingredient fetch calls
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error(sessionError?.message || "User not authenticated.");
        }

        const [categoriesRes, ingredientsRes] = await Promise.all([
          fetch("http://localhost:3000/api/ingredient-categories", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch("http://localhost:3000/api/ingredients", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ]);

        if (!categoriesRes.ok) {
          const errorData = await categoriesRes.json();
          throw new Error(
            errorData.error ||
              `HTTP error! status: ${categoriesRes.status} for ingredient categories`
          );
        }
        if (!ingredientsRes.ok) {
          const errorData = await ingredientsRes.json();
          throw new Error(
            errorData.error ||
              `HTTP error! status: ${ingredientsRes.status} for ingredients`
          );
        }

        const categoriesData: IngredientCategory[] = await categoriesRes.json();
        const ingredientsData: Ingredient[] = await ingredientsRes.json();

        setIngredientCategories(categoriesData);
        setAllIngredients(ingredientsData);

        if (initialData?.ingredients && initialData.ingredients.length > 0) {
          const initialCategoryIds = new Set<string>();
          initialData.ingredients.forEach((ing) => {
            const fullIngredient = ingredientsData.find(
              (aIng) => aIng.id === ing.id
            );
            if (fullIngredient?.ingredient_category_id) {
              initialCategoryIds.add(fullIngredient.ingredient_category_id);
            }
          });
          setSelectedIngredientCategoryIds(Array.from(initialCategoryIds));
        } else {
          setSelectedIngredientCategoryIds([]);
        }
      } catch (err) {
        console.error("Failed to fetch ingredient data:", err);
        setIngredientDataError("Failed to load ingredients data.");
      } finally {
        setIngredientDataLoading(false);
      }
    };

    fetchIngredientData();
  }, [initialData]);

  // Effect to filter ingredients based on selected ingredient categories
  useEffect(() => {
    if (selectedIngredientCategoryIds.length === 0) {
      setFilteredIngredients(allIngredients);
    } else {
      setFilteredIngredients(
        allIngredients.filter(
          (ing) =>
            ing.ingredient_category_id &&
            selectedIngredientCategoryIds.includes(ing.ingredient_category_id)
        )
      );
    }
  }, [selectedIngredientCategoryIds, allIngredients]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "ingredient_ids") {
      const selectElement = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(selectElement.options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        ingredient_ids: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleIngredientCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectElement = e.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedIngredientCategoryIds(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !formData.name ||
      formData.price === undefined ||
      !formData.category_id
    ) {
      setError("Name, price, and category are required.");
      setLoading(false);
      return;
    }

    try {
      // FIX 4: Add Authorization to the form submission fetch call
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error(sessionError?.message || "User not authenticated.");
      }

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `http://localhost:3000/api/menu/${initialData.id}`
        : "http://localhost:3000/api/menu";

      const payload = {
        ...formData,
        video_url: formData.video_url === "" ? null : formData.video_url,
        making_process:
          formData.making_process === "" ? null : formData.making_process,
        sub_category_id:
          formData.sub_category_id === "" ? null : formData.sub_category_id,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setSuccess("Menu item saved successfully!");
      console.log("Menu item saved:", result);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/menu");
      }
    } catch (err: any) {
      console.error("Failed to save menu item:", err);
      setError(err.message || "Failed to save menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading || ingredientDataLoading) {
    return (
      <div className="text-center py-8 text-gray-700">Loading form data...</div>
    );
  }

  if (categoriesError || ingredientDataError) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {categoriesError || ingredientDataError}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-8"
    >
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        {initialData
          ? "Edit Arctic Dessert Item"
          : "Add New Arctic Dessert Item"}
      </h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative mb-6"
          role="alert"
        >
          {success}
        </div>
      )}

      {/* General Item Details Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
          Basic Item Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="category_id"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category:
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !categoriesLoading && (
              <p className="text-red-500 text-xs italic mt-1">
                Please add categories in Supabase first.
              </p>
            )}
          </div>

          {formData.category_id && (
            <div className="mb-4">
              <label
                htmlFor="sub_category_id"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Sub-Category (Optional):
              </label>
              <select
                id="sub_category_id"
                name="sub_category_id"
                value={formData.sub_category_id || ""}
                onChange={handleChange}
                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                disabled={subCategoriesLoading}
              >
                <option value="">Select a sub-category (Optional)</option>
                {subCategoriesLoading && (
                  <option>Loading sub-categories...</option>
                )}
                {subCategoriesError && (
                  <option className="text-red-500">{subCategoriesError}</option>
                )}
                {!subCategoriesLoading &&
                  subCategories.length === 0 &&
                  !subCategoriesError &&
                  formData.category_id && (
                    <option value="" disabled>
                      No sub-categories for this category
                    </option>
                  )}
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Media Links Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
          Media Links
        </h3>
        <div className="mb-4">
          <label
            htmlFor="image_url"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="e.g., https://example.com/dessert.jpg"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="video_url"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Video Link (Optional):
          </label>
          <input
            type="text"
            id="video_url"
            name="video_url"
            value={formData.video_url || ""}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="e.g., https://youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Making Process Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
          Making Process
        </h3>
        <div className="mb-6">
          <label
            htmlFor="making_process"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Step-by-step Instructions:
          </label>
          <textarea
            id="making_process"
            name="making_process"
            value={formData.making_process || ""}
            onChange={handleChange}
            rows={7}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="1. First step
2. Second step
3. ..."
          ></textarea>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-300">
          Ingredients
        </h3>

        {/* Multi-select Ingredient Categories */}
        <div className="mb-4">
          <label
            htmlFor="ingredient_category_ids"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Filter Ingredients by Category (Select multiple):
          </label>
          <select
            id="ingredient_category_ids"
            name="ingredient_category_ids"
            multiple
            value={selectedIngredientCategoryIds}
            onChange={handleIngredientCategoryChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-28"
            disabled={ingredientDataLoading}
          >
            <option value="">
              Show All Categories (and their ingredients)
            </option>
            {ingredientCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-gray-600 text-xs italic mt-1">
            Hold Ctrl (Windows/Linux) or Cmd (macOS) to select multiple
            categories.
          </p>
        </div>

        {/* Ingredients List filtered by selected categories */}
        <div className="mb-6">
          <label
            htmlFor="ingredient_ids"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ingredients (Select multiple):
          </label>
          <select
            id="ingredient_ids"
            name="ingredient_ids"
            multiple
            value={formData.ingredient_ids}
            onChange={handleChange}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-48"
            disabled={ingredientDataLoading}
          >
            {ingredientDataLoading && <option>Loading ingredients...</option>}
            {ingredientDataError && (
              <option className="text-red-500">{ingredientDataError}</option>
            )}
            {!ingredientDataLoading &&
              filteredIngredients.length === 0 &&
              !ingredientDataError && (
                <option value="" disabled>
                  No ingredients available (try changing category filter)
                </option>
              )}
            {filteredIngredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}{" "}
                {ingredient.ingredient_categories
                  ? `(${ingredient.ingredient_categories.name})`
                  : ""}
              </option>
            ))}
          </select>
          <p className="text-gray-600 text-xs italic mt-1">
            Hold Ctrl (Windows/Linux) or Cmd (macOS) to select multiple
            ingredients.
          </p>
        </div>
      </div>

      {/* Active Status */}
      <div className="mb-6 flex items-center justify-center bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="is_active"
          className="text-gray-700 text-base font-bold"
        >
          Is Active
        </label>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          type="submit"
          disabled={
            loading ||
            categoriesLoading ||
            subCategoriesLoading ||
            ingredientDataLoading
          }
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Arctic Dessert Item"
            : "Add Arctic Dessert Item"}
        </button>
      </div>
    </form>
  );
}

export default MenuItemForm;
