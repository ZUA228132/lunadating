import { createClient } from '@supabase/supabase-js';

/*
 * Creates a Supabase client for client‑side use.  When called on the server
 * (e.g. within API routes), you can optionally pass the `serviceRoleKey` to
 * gain elevated privileges.  Never expose your service role key in the
 * browser.  See `.env.example` for variable definitions.
 */
export function getSupabaseClient(serviceRoleKey?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || (!supabaseAnonKey && !serviceRoleKey)) {
    throw new Error(
      'Missing Supabase environment variables.  Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  // Use the anonymous key by default for client‑side requests.
  const key = serviceRoleKey ?? supabaseAnonKey;
  return createClient(supabaseUrl!, key!, {
    auth: {
      persistSession: true
    }
  });
}