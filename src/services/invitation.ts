import type { Invitation } from '@/types/invitation';
import { InvitationRepository } from '@/repositories/invitation';
import { sendEmail } from '@/lib/email';
import { env } from '@/lib/env';
import { InvitationEmail } from '@/emails/InvitationEmail';

export const InvitationService = {
  async send(email: string, invitedBy: string): Promise<Invitation> {
    const invitation = await InvitationRepository.create(email, invitedBy);
    if (!invitation) throw new Error('Failed to create invitation');

    const inviteUrl = `${env.appUrl}/invite/${invitation.token}`;

    await sendEmail(email, "You've been invited", InvitationEmail({ inviteUrl }));

    return invitation;
  },

  async resend(id: string, updatedBy: string): Promise<Invitation> {
    const invitation = await InvitationRepository.updateStatus(
      id,
      'resent',
      updatedBy
    );
    if (!invitation) throw new Error('Failed to update invitation');

    const inviteUrl = `${env.appUrl}/invite/${invitation.token}`;

    await sendEmail(invitation.email, "You've been invited", InvitationEmail({ inviteUrl }));

    return invitation;
  },

  async accept(token: string, userId: string): Promise<Invitation> {
    const invitation = await InvitationRepository.getByToken(token);
    if (!invitation) throw new Error('Invalid invitation');
    if (invitation.status === 'accepted')
      throw new Error('Invitation already accepted');
    if (invitation.status === 'cancelled')
      throw new Error('Invitation has been cancelled');
    if (new Date(invitation.expiresAt) < new Date())
      throw new Error('Invitation has expired');

    const updated = await InvitationRepository.updateStatus(
      invitation.id,
      'accepted',
      userId
    );
    if (!updated) throw new Error('Failed to accept invitation');
    return updated;
  },

  async cancel(id: string, updatedBy: string): Promise<Invitation> {
    const invitation = await InvitationRepository.updateStatus(
      id,
      'cancelled',
      updatedBy
    );
    if (!invitation) throw new Error('Failed to cancel invitation');
    return invitation;
  },
};
