export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
};
