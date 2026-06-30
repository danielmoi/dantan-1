import { createServerClient } from '@supabase/ssr';
import { deleteCookie, parseCookies, setCookie } from '@tanstack/react-start/server';
import { env } from '@/lib/env';

export function createSupabaseServerClient() {
  return createServerClient(
    env.supabaseUrl ?? '',
    env.supabaseAnonKey ?? '',
    {
      cookies: {
        getAll() {
          const cookies = parseCookies();
          return Object.entries(cookies).map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options);
          });
        },
      },
    },
  );
}
