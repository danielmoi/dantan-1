import type { Profile, ProfileRow } from '@/types/profile';
import { supabase } from '@/lib/supabase';

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    isSuperAdmin: row.is_super_admin,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const ProfileRepository = {
  async get(id: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    return data ? toProfile(data as ProfileRow) : null;
  },

  async upsert(row: Partial<ProfileRow> & { id: string }): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...row, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) return null;
    return toProfile(data as ProfileRow);
  },
};
