// backend/src/controllers/departmentController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Controller to get all departments
export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const { data: departments, error } = await supabaseAdmin
      .from("departments")
      .select("*");

    if (error) {
      console.error("Error fetching departments:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(departments);
  } catch (err) {
    console.error("Unexpected error in getAllDepartments controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get a single department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: department, error } = await supabaseAdmin
      .from("departments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching department by ID:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!department) {
      return res.status(404).json({ error: "Department not found." });
    }

    res.status(200).json(department);
  } catch (err) {
    console.error("Unexpected error in getDepartmentById controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to create a new department
export const createDepartment = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Department name is required." });
  }

  try {
    const { data: newDepartment, error } = await supabaseAdmin
      .from("departments")
      .insert([{ name, description }])
      .select()
      .single();

    if (error) {
      console.error("Error creating department:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error("Unexpected error in createDepartment controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to update an existing department
export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const { data: updatedDepartment, error } = await supabaseAdmin
      .from("departments")
      .update({ name, description })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating department:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(updatedDepartment);
  } catch (err) {
    console.error("Unexpected error in updateDepartment controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to delete a department
export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting department:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Department deleted successfully." });
  } catch (err) {
    console.error("Unexpected error in deleteDepartment controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
