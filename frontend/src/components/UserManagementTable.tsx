// src/components/UserManagementTable.tsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { UserProfile } from "../pages/AdminDashboard";
import UserFormModal from "./UserFormModal";

interface UserManagementTableProps {
  users: UserProfile[];
  rolesMap: { [key: string]: string };
  loading: boolean;
  error: string | null;
  onUserUpdate: () => void;
  currentUserId: string | undefined; // <-- NEW PROP
  adminCount: number | null; // <-- NEW PROP
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  rolesMap,
  loading,
  error,
  onUserUpdate,
  currentUserId, // <-- USE NEW PROP
  adminCount, // <-- USE NEW PROP
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const handleEdit = (user: UserProfile) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    // Check if the user is the last admin
    const isLastAdmin = userId === currentUserId && adminCount === 1;

    if (isLastAdmin) {
      alert("You cannot delete the last remaining admin account.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch(
          `http://localhost:3000/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete user");
        }

        onUserUpdate(); // Re-fetch the list to update the UI
      } catch (err: any) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User List</h2>
        <button
          onClick={() => {
            setCurrentUser(null);
            setIsModalOpen(true);
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {rolesMap[user.role_id] || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className={`text-red-600 hover:text-red-900 ${
                      user.id === currentUserId && adminCount === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={user.id === currentUserId && adminCount === 1} // <-- DISABLES BUTTON
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={currentUser}
        onUserUpdate={onUserUpdate}
        rolesMap={rolesMap} // <-- PASS NEW PROPS
        currentUserId={currentUserId} // <-- PASS NEW PROPS
        adminCount={adminCount} // <-- PASS NEW PROPS
      />
    </div>
  );
};

export default UserManagementTable;
