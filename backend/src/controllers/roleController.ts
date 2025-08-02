// backend/src/controllers/roleController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Controller to get all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const { data: roles, error } = await supabaseAdmin
      .from("roles")
      .select("*");

    if (error) {
      console.error("Error fetching roles:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(roles);
  } catch (err) {
    console.error("Unexpected error in getAllRoles controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get a single role by ID
export const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: role, error } = await supabaseAdmin
      .from("roles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching role by ID:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!role) {
      return res.status(404).json({ error: "Role not found." });
    }

    res.status(200).json(role);
  } catch (err) {
    console.error("Unexpected error in getRoleById controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to create a new role
export const createRole = async (req: Request, res: Response) => {
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Role name is required." });
  }

  try {
    const { data: newRole, error } = await supabaseAdmin
      .from("roles")
      .insert([{ name, permissions: permissions || null }])
      .select()
      .single();

    if (error) {
      console.error("Error creating role:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(newRole);
  } catch (err) {
    console.error("Unexpected error in createRole controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to update an existing role
export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  try {
    const { data: updatedRole, error } = await supabaseAdmin
      .from("roles")
      .update({ name, permissions: permissions || null })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating role:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(updatedRole);
  } catch (err) {
    console.error("Unexpected error in updateRole controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to delete a role
export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin.from("roles").delete().eq("id", id);

    if (error) {
      console.error("Error deleting role:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Role deleted successfully." });
  } catch (err) {
    console.error("Unexpected error in deleteRole controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
