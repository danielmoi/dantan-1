export type InvitationStatus = 'created' | 'resent' | 'cancelled' | 'expired' | 'accepted';

export type InvitationRow = {
  id: string;
  email: string;
  invited_by: string;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type Invitation = {
  id: string;
  email: string;
  invitedBy: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
};
