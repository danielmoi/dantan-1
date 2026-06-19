import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from '@/types/profile';
import { ProfileService } from '@/services/profile';
import { useAuth } from '@/lib/auth';

type ProfileContextType = {
  profile: Profile | null;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    ProfileService.onLogin(user).then(setProfile);
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
