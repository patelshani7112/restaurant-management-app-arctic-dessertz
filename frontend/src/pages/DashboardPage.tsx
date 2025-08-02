// frontend/src/pages/DashboardPage.tsx
import React from "react";
import { useAuth } from "../services/auth.tsx"; // Import useAuth hook

function DashboardPage() {
  const { user } = useAuth(); // Get user from auth context

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      {user ? (
        <p className="mt-4 text-lg text-gray-700">
          Welcome, <span className="font-semibold">{user.email}</span>! You are
          logged in.
        </p>
      ) : (
        <p className="mt-4 text-lg text-gray-700">
          You are not logged in. Please log in to view the dashboard content.
        </p>
      )}
      <p className="mt-4 text-gray-600">
        This is your management dashboard. You can access various features from
        here.
      </p>
    </div>
  );
}

export default DashboardPage;
