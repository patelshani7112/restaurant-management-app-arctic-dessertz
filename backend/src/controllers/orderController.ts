// backend/src/controllers/orderController.ts
import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabaseAdminClient";

// Controller to get all orders with their items
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Fetch all orders with a join to get the order items
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*, menu_items(*))") // Selects orders, their items, and the menu item details
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Unexpected error in getAllOrders controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get a single order by ID with its items
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*, menu_items(*))")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching order by ID:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Unexpected error in getOrderById controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to create a new order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res
      .status(400)
      .json({ error: "Order must contain at least one item." });
  }

  // Calculate total amount from order items
  const total_amount = orderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  try {
    // 1. Insert the new order into the orders table
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([{ user_id: userId || null, total_amount, status: "pending" }])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return res.status(400).json({ error: orderError.message });
    }

    // 2. Map order items to the new order_id
    const itemsToInsert = orderItems.map((item: any) => ({
      order_id: newOrder.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
    }));

    // 3. Insert all order items into the order_items table
    const { data: newOrderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsToInsert)
      .select();

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return res.status(400).json({ error: itemsError.message });
    }

    res.status(201).json({
      message: "Order created successfully",
      order: { ...newOrder, order_items: newOrderItems },
    });
  } catch (err) {
    console.error("Unexpected error in createOrder controller:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};
