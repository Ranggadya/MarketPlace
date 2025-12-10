import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// SSR Client for user authentication and client-side operations
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { }
        },
      },
    }
  );
};

// Service Role Client for server-side operations (admin access)
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

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
