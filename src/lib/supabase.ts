import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export const supabase = createBrowserClient(
  env.supabaseUrl ?? 'https://placeholder.supabase.co',
  env.supabaseAnonKey ?? 'placeholder',
);
