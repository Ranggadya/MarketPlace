import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
if (!supabaseUrl) {
  throw new Error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local"
  );
}
if (!supabaseKey) {
  throw new Error(
    "❌ Missing SUPABASE_SERVICE_ROLE in .env.local"
  );
}
export const supabase = createClient(supabaseUrl, supabaseKey);
