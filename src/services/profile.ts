import type { User } from '@/types/auth';
import type { Profile } from '@/types/profile';
import { ProfileRepository } from '@/repositories/profile';

export const ProfileService = {
  async onLogin(user: User): Promise<Profile | null> {
    return ProfileRepository.upsert({
      id: user.id,
      email: user.email ?? null,
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });
  },

  async get(id: string): Promise<Profile | null> {
    return ProfileRepository.get(id);
  },
};
