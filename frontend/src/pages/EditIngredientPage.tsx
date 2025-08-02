// frontend/src/pages/EditIngredientPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IngredientForm from "../components/IngredientForm";
// ADDED: Import Supabase client
import { supabase } from "../supabaseClient";

interface Ingredient {
  id: string;
  name: string;
  category_id: string;
}

function EditIngredientPage() {
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!id) {
        setError("No ingredient ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // FIX: Add authentication to the fetch call
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error(sessionError?.message || "User not authenticated.");
        }

        const response = await fetch(
          `http://localhost:3000/api/ingredients/${id}`,
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
        const data: Ingredient = await response.json();
        setIngredient(data);
      } catch (err: any) {
        console.error("Failed to fetch ingredient:", err);
        setError("Failed to load ingredient for editing.");
      } finally {
        setLoading(false);
      }
    };
    fetchIngredient();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading ingredient details...
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

  if (!ingredient) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Ingredient not found.
      </div>
    );
  }

  return (
    <IngredientForm
      initialData={{
        id: ingredient.id,
        name: ingredient.name,
        category_id: ingredient.category_id,
      }}
      isEditMode={true}
    />
  );
}

export default EditIngredientPage;
