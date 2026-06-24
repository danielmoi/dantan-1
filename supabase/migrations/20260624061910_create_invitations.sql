create type invitation_status as enum ('created', 'resent', 'cancelled', 'expired', 'accepted');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invited_by uuid not null references auth.users(id),
  token uuid not null default gen_random_uuid(),
  status invitation_status not null default 'created',
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.invitations enable row level security;

create policy "Super admins can manage invitations" on public.invitations
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_super_admin = true
    )
  );
