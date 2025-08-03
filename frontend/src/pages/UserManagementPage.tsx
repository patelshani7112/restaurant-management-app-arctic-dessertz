// src/pages/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../services/auth";
import UserManagementTable from "../components/UserManagementTable";
import axios from "axios";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  department_id: string | null;
}

const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rolesMap, setRolesMap] = useState<{ [key: string]: string }>({});
  const [rolesLoading, setRolesLoading] = useState(true);

  // <-- NEW STATE FOR ADMIN COUNT -->
  const [adminCount, setAdminCount] = useState<number | null>(null);

  // <-- NEW ASYNC FUNCTION TO FETCH ADMIN COUNT -->
  const fetchAdminCount = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.access_token) return;

      const response = await axios.get(
        "http://localhost:3000/api/users/admin-count",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      setAdminCount(response.data.count);
    } catch (err) {
      console.error("Failed to fetch admin count:", err);
    }
  };

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.access_token) {
        throw new Error("No active session found for fetching roles.");
      }

      const response = await axios.get("http://localhost:3000/api/roles", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const rolesData = response.data.reduce((map: any, role: any) => {
        map[role.id] = role.name;
        return map;
      }, {});
      setRolesMap(rolesData);
    } catch (err: any) {
      console.error("Failed to fetch roles:", err);
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session || !session.access_token) {
        throw new Error("No active session found.");
      }

      const response = await fetch("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch users: ${response.statusText}. Details: ${errorData.error}`
        );
      }

      const data: UserProfile[] = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAdminCount(); // <-- CALL NEW FUNCTION ON MOUNT
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUserUpdate = () => {
    fetchUsers();
    fetchAdminCount(); // <-- RE-FETCH COUNT AFTER UPDATE
  };

  const isOverallLoading = loading || rolesLoading || adminCount === null; // <-- UPDATE LOADING STATE

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
      </div>
      <UserManagementTable
        users={users}
        rolesMap={rolesMap}
        loading={isOverallLoading}
        error={error}
        onUserUpdate={handleUserUpdate}
        currentUserId={user?.id} // <-- PASS CURRENT USER ID
        adminCount={adminCount} // <-- PASS ADMIN COUNT
      />
    </div>
  );
};

export default UserManagementPage;
