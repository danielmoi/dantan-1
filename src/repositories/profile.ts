import type { Profile } from '@/types/profile';
import { supabase } from '@/lib/supabase';

export const ProfileRepository = {
  async get(id: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    return data as Profile | null;
  },

  async upsert(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) return null;
    return data as Profile;
  },
};
