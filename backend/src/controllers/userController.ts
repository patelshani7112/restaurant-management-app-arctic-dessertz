import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";
import jwt, { JwtPayload } from "jsonwebtoken";

// Helper function to get the ID of the 'Admin' role
const getAdminRoleId = async () => {
  const { data: role, error } = await supabaseAdmin
    .from("roles")
    .select("id")
    .eq("name", "Admin")
    .single();

  if (error || !role) {
    return null;
  }
  return role.id;
};

// Controller to create a new user (Admin only)
export const createUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    role_id,
    department_id,
  } = req.body;

  if (!email || !password || !first_name || !last_name || !role_id) {
    return res.status(400).json({
      error:
        "Missing required user fields: email, password, first_name, last_name, role_id.",
    });
  }

  try {
    const { data: userAuth, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!userAuth || !userAuth.user) {
      return res
        .status(500)
        .json({ error: "Supabase did not return user data after creation." });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name,
        last_name,
        phone_number: phone_number || null,
        role_id,
        department_id: department_id || null,
      })
      .eq("id", userAuth.user.id)
      .select()
      .single();

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userAuth.user.id);
      return res.status(500).json({
        error: "Failed to create user profile: " + profileError.message,
      });
    }

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: userAuth.user.id,
        email: userAuth.user.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role_id: profile.role_id,
        department_id: profile.department_id,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error during user creation." });
  }
};

// Controller to get all users with profile data
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, first_name, last_name, phone_number, role_id, department_id"
      );

    if (profilesError) {
      return res.status(500).json({ error: profilesError.message });
    }

    const { data: authUsers, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    const profilesMap = new Map(profiles.map((p) => [p.id, p]));

    const combinedUsers = authUsers.users.map((authUser) => {
      const profile = profilesMap.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        phone_number: profile?.phone_number || null,
        role_id: profile?.role_id || null,
        department_id: profile?.department_id || null,
      };
    });

    res.status(200).json(combinedUsers);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get the count of admin users
export const getAdminCount = async (req: Request, res: Response) => {
  try {
    const adminRoleId = await getAdminRoleId();
    if (!adminRoleId) {
      return res.status(500).json({ error: "Admin role ID not found." });
    }

    const { count, error } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role_id", adminRoleId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to update an existing user (Admin only)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, role_id, department_id } =
    req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Authorization token not found." });
  let currentUserId: string | null = null;
  try {
    const decodedToken = jwt.decode(token) as JwtPayload;
    currentUserId = decodedToken.sub as string;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }

  try {
    const adminRoleId = await getAdminRoleId();
    if (!adminRoleId) {
      return res.status(500).json({ error: "Admin role ID not found." });
    }

    if (id === currentUserId && role_id !== adminRoleId) {
      return res
        .status(403)
        .json({ error: "An admin cannot change their own role." });
    }

    if (id === currentUserId) {
      const { count, error: countError } = await supabaseAdmin
        .from("profiles")
        .select("id", { count: "exact" })
        .eq("role_id", adminRoleId);

      if (count === 1 && role_id !== adminRoleId) {
        return res.status(403).json({
          error: "Cannot change the role of the last remaining admin.",
        });
      }
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name,
        last_name,
        phone_number: phone_number || null,
        role_id,
        department_id: department_id || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({
        error: "Failed to update user profile: " + profileError.message,
      });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: profile });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error during user update." });
  }
};

// Controller to delete a user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Authorization token not found." });
  let currentUserId: string | null = null;
  try {
    const decodedToken = jwt.decode(token) as JwtPayload;
    currentUserId = decodedToken.sub as string;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }

  try {
    const adminRoleId = await getAdminRoleId();
    if (!adminRoleId) {
      return res.status(500).json({ error: "Admin role ID not found." });
    }

    // Check if the user being deleted is the same as the logged-in user
    // and if they are an admin.
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role_id")
      .eq("id", currentUserId)
      .single();

    if (profileError || !userProfile) {
      return res
        .status(500)
        .json({ error: "Could not fetch current user profile." });
    }

    // If the logged-in user is an admin and is trying to delete their own account, block it.
    if (id === currentUserId && userProfile.role_id === adminRoleId) {
      return res
        .status(403)
        .json({ error: "An admin cannot delete their own account." });
    }

    // This is the original "last admin" logic, which is still a good safeguard.
    // It prevents any admin from deleting the last admin account, even if it's not their own.
    const { count, error: countError } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact" })
      .eq("role_id", adminRoleId);

    if (count === 1) {
      return res
        .status(403)
        .json({ error: "Cannot delete the last remaining admin account." });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error during user deletion." });
  }
};
