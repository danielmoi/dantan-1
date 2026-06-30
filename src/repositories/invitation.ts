import type { Invitation, InvitationRow, InvitationStatus } from '@/types/invitation';
import { supabase } from '@/lib/supabase';

export function toInvitation(row: InvitationRow): Invitation {
  return {
    id: row.id,
    email: row.email,
    invitedBy: row.invited_by,
    token: row.token,
    status: row.status,
    expiresAt: row.expires_at,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export const InvitationRepository = {
  async create(email: string, invitedBy: string): Promise<Invitation | null> {
    const { data, error } = await supabase
      .from('invitations')
      .insert({ email, invited_by: invitedBy })
      .select()
      .single();

    if (error) return null;
    return toInvitation(data as InvitationRow);
  },

  async getByToken(token: string): Promise<Invitation | null> {
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();

    return data ? toInvitation(data as InvitationRow) : null;
  },

  async updateStatus(id: string, status: InvitationStatus, updatedBy: string): Promise<Invitation | null> {
    const { data, error } = await supabase
      .from('invitations')
      .update({
        status,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
        ...(status === 'accepted' ? { accepted_at: new Date().toISOString() } : {}),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    return toInvitation(data as InvitationRow);
  },

  async list(): Promise<Invitation[]> {
    const { data } = await supabase
      .from('invitations')
      .select('*')
      .order('created_at', { ascending: false });

    return (data as InvitationRow[] ?? []).map(toInvitation);
  },
};
