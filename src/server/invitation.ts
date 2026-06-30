import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import type { InvitationRow } from '@/types/invitation';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { toInvitation } from '@/repositories/invitation';
import { InvitationEmail } from '@/emails/InvitationEmail';

export const resendInvite = createServerFn({ method: 'POST' })
  .validator((data: unknown) =>
    z.object({ id: z.uuid() }).parse(data)
  )
  .handler(async ({ data }) => {
    const client = createSupabaseServerClient();

    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) throw new Error('Unauthorized');

    const { data: profile } = await client
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_super_admin) throw new Error('Forbidden');

    const { data: row, error: fetchError } = await client
      .from('invitations')
      .select('*')
      .eq('id', data.id)
      .single();

    if (fetchError || !row) throw new Error('Invitation not found');

    const { data: updated, error: updateError } = await client
      .from('invitations')
      .update({ status: 'resent', updated_at: new Date().toISOString(), updated_by: user.id })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError || !updated) throw new Error('Failed to update invitation');

    const invitation = toInvitation(updated as InvitationRow);

    await sendEmail(
      invitation.email,
      "You've been invited",
      InvitationEmail({ inviteUrl: `${env.appUrl}/invite/${invitation.token}` }),
    );

    return invitation;
  });

export const sendInvite = createServerFn({ method: 'POST' })
  .validator((data: unknown) =>
    z.object({ email: z.email() }).parse(data)
  )
  .handler(async ({ data }) => {
    const client = createSupabaseServerClient();

    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) throw new Error('Unauthorized');

    const { data: profile } = await client
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_super_admin) throw new Error('Forbidden');

    const { data: row, error: insertError } = await client
      .from('invitations')
      .insert({ email: data.email, invited_by: user.id })
      .select()
      .single();

    if (insertError || !row) throw new Error('Failed to create invitation');

    const invitation = toInvitation(row as InvitationRow);

    await sendEmail(
      data.email,
      "You've been invited",
      InvitationEmail({ inviteUrl: `${env.appUrl}/invite/${invitation.token}` }),
    );

    return invitation;
  });
