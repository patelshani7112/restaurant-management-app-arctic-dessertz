// backend/src/config/supabaseAdminClient.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables here as this file needs them directly
// Note: dotenv.config() should ideally be called once at the app's entry point (server.ts)
// However, for this separate config file to work standalone or be imported, it's safer to include it here too.
// If it's already configured by server.ts, this call will just return.
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables!"
  );
  // In a real app, you might throw an error or handle graceful shutdown
  // For now, we'll let it proceed but the client will be undefined/null if not handled
  process.exit(1); // Exit process if critical env vars are missing
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
