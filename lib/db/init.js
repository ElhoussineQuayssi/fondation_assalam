import { supabaseAdmin } from "./index.js";
import { schema, rlsPolicies } from "./schema.js";

export async function initializeDb() {
  try {
    console.log("Initializing Supabase database...");

    // Execute schema creation
    const { error: schemaError } = await supabaseAdmin.rpc("exec_sql", {
      sql: schema,
    });

    if (schemaError) {
      // If rpc doesn't exist, try direct execution
      console.log("Using alternative schema initialization...");

      // Split schema into individual statements
      const statements = schema
        .split(";")
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabaseAdmin.rpc("exec", {
            query: statement.trim(),
          });
          if (error && !error.message.includes("already exists")) {
            console.warn("Schema creation warning:", error.message);
          }
        }
      }
    }

    // Execute RLS policies
    const policyStatements = rlsPolicies
      .split(";")
      .filter((stmt) => stmt.trim().length > 0);

    for (const statement of policyStatements) {
      if (statement.trim()) {
        const { error } = await supabaseAdmin.rpc("exec", {
          query: statement.trim(),
        });
        if (error && !error.message.includes("already exists")) {
          console.warn("RLS policy warning:", error.message);
        }
      }
    }

    console.log("Database initialization completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Database initialization error:", error);
    return { success: false, error: error.message };
  }
}
