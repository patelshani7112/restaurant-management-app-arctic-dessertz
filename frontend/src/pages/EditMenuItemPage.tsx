// frontend/src/pages/EditMenuItemPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MenuItemForm from "../components/MenuItemForm"; // Adjust path if necessary

// Re-define MenuItem interface here to ensure consistency
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
  ingredients: Array<{ id: string; name: string; category_name: string }>; // Adjusted for what backend sends
}

function EditMenuItemPage() {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      if (!id) {
        setError("No menu item ID provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/menu/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const data: MenuItem = await response.json();
        setMenuItem(data);
      } catch (err: any) {
        console.error("Failed to fetch menu item for editing:", err);
        setError(`Failed to load menu item: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]); // Re-fetch if ID changes (though usually not for this page)

  const handleSuccess = () => {
    navigate("/menu"); // Go back to menu list after successful edit
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Loading menu item for editing...
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

  if (!menuItem) {
    return (
      <div className="text-center py-8 text-lg text-gray-700">
        Menu item not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <MenuItemForm initialData={menuItem} onSuccess={handleSuccess} />
    </div>
  );
}

export default EditMenuItemPage;
