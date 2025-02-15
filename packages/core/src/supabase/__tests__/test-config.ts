export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "test-anon-key",
  serviceRoleKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY || "test-service-role-key",
};
