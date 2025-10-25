import { createClient } from "@supabase/supabase-js";

// Supabase configuration with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL is required - Supabase client cannot be initialized");
}

if (!supabaseKey) {
  console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is required - Supabase client cannot be initialized");
}

if (!supabaseServiceKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is required - Admin operations will not be available");
}

// Check if we have the minimum required variables for client creation
const hasRequiredVars = supabaseUrl && supabaseKey;

// Singleton pattern for client-side Supabase client to prevent multiple GoTrueClient instances
let supabaseInstance = null;

function getSupabaseClient() {
  // Check if we have required environment variables
  if (!hasRequiredVars) {
    console.warn("Supabase environment variables not available, returning null client - check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }

  if (typeof window === 'undefined') {
    // Server-side: always create a new client
    try {
      const client = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase server-side client created successfully");
      return client;
    } catch (error) {
      console.error("Failed to create server-side Supabase client:", error);
      return null;
    }
  }

  // Client-side: use singleton to prevent multiple GoTrueClient instances
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase client-side client created successfully");
    } catch (error) {
      console.error("Failed to create client-side Supabase client:", error);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

// For server-side operations that need admin privileges
let supabaseAdmin;
if (hasRequiredVars && supabaseServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log("Supabase admin client created successfully");
  } catch (error) {
    console.error("Failed to create Supabase admin client:", error);
    supabaseAdmin = null;
  }
} else {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is required - Supabase admin client not created due to missing environment variables");
  supabaseAdmin = null;
}

// Export clients
export const supabase = getSupabaseClient();
export { supabaseAdmin };

// Default export for backward compatibility
export default supabase;
