import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { ProfileRepository } from '@/repositories/profile';
import { InvitationService } from '@/services/invitation';
import { InvitationRepository } from '@/repositories/invitation';

export const sendInvite = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ email: z.string().email() }).parse(data))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const profile = await ProfileRepository.get(session.user.id);
    if (!profile?.isSuperAdmin) throw new Error('Forbidden');

    return InvitationService.send(data.email, session.user.id);
  });

export const cancelInvite = createServerFn({ method: 'POST' })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const profile = await ProfileRepository.get(session.user.id);
    if (!profile?.isSuperAdmin) throw new Error('Forbidden');

    return InvitationService.cancel(data.id, session.user.id);
  });

export const listInvites = createServerFn({ method: 'GET' })
  .handler(async () => {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const profile = await ProfileRepository.get(session.user.id);
    if (!profile?.isSuperAdmin) throw new Error('Forbidden');

    return InvitationRepository.list();
  });
