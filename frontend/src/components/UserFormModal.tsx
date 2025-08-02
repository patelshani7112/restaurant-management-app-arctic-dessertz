// src/components/UserFormModal.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { UserProfile } from "../pages/AdminDashboard";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: UserProfile | null;
  onUserUpdate: () => void;
  rolesMap: { [key: string]: string }; // <-- NEW PROP
  currentUserId: string | undefined; // <-- NEW PROP
  adminCount: number | null; // <-- NEW PROP
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onUserUpdate,
  rolesMap, // <-- USE NEW PROP
  currentUserId, // <-- USE NEW PROP
  adminCount, // <-- USE NEW PROP
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  // Check if the user is an admin and is editing their own profile.
  const isEditingMyAdminAccount =
    userToEdit?.id === currentUserId &&
    rolesMap[userToEdit.role_id] === "Admin";
  // We still need the isEditingLastAdmin for the specific last admin message and submit button logic.
  const isEditingLastAdmin =
    userToEdit?.id === currentUserId && adminCount === 1;

  useEffect(() => {
    // Populate form with user data if in edit mode
    if (userToEdit) {
      setEmail(userToEdit.email);
      setFirstName(userToEdit.first_name);
      setLastName(userToEdit.last_name);
      setRoleId(userToEdit.role_id);
    } else {
      // Clear form for new user
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setRoleId("");
    }

    // Fetch roles from Supabase to populate the dropdown
    const fetchRoles = async () => {
      const { data, error } = await supabase.from("roles").select("id, name");
      if (error) {
        console.error("Error fetching roles:", error);
      } else {
        setRoles(data);
      }
    };
    fetchRoles();
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // <-- NEW FRONTEND VALIDATION -->
    // Check if an admin is editing their own profile and trying to change their role
    if (isEditingMyAdminAccount && rolesMap[roleId] !== "Admin") {
      alert("You cannot change your own admin role.");
      setLoading(false);
      return;
    }

    // <-- FRONTEND VALIDATION FOR LAST ADMIN ROLE CHANGE -->
    // This is the original check for the very last admin.
    if (isEditingLastAdmin && rolesMap[roleId] !== "Admin") {
      alert("You cannot change the role of the last remaining admin account.");
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      let response;
      if (userToEdit) {
        // Handle UPDATE
        response = await fetch(
          `http://localhost:3000/api/users/${userToEdit.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              role_id: roleId,
            }),
          }
        );
      } else {
        // Handle CREATE
        response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            role_id: roleId,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${userToEdit ? "update" : "create"} user`
        );
      }

      onUserUpdate(); // Refresh the user list
      onClose(); // Close the modal
    } catch (err: any) {
      console.error("Error submitting form:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {userToEdit ? "Edit User" : "Add New User"}
        </h2>
        {/* <-- UPDATED WARNING MESSAGE --> */}
        {isEditingMyAdminAccount && (
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Warning</p>
            <p>You cannot change your own admin role.</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!!userToEdit} // Disable email edit
              required
            />
          </div>
          {!userToEdit && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={isEditingMyAdminAccount} // <-- UPDATED LOGIC TO DISABLE DROPDOWN
              required
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={
                loading ||
                (isEditingMyAdminAccount && rolesMap[roleId] !== "Admin")
              } // <-- UPDATED LOGIC TO DISABLE BUTTON
            >
              {loading ? "Saving..." : userToEdit ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
