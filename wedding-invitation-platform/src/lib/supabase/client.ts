'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client. Safe to call multiple times —
 * createBrowserClient memoizes internally per the @supabase/ssr docs.
 *
 * Until real project credentials are set in `.env.local`, these
 * fall back to harmless placeholders so the app still boots for
 * UI/design review; any real database call will simply fail with
 * a clear "Supabase not configured" error surfaced in the admin UI.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';
  return createBrowserClient(url, anonKey);
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
