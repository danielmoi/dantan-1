import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase.server';

export const getAuthUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { data: { user } } = await createSupabaseServerClient().auth.getUser();
  return user ?? null;
});

export const exchangeCode = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ code: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await createSupabaseServerClient().auth.exchangeCodeForSession(data.code);
    if (error) throw new Error(error.message);
  });
