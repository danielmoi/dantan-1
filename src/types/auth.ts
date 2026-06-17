import type { Session, User } from '@supabase/supabase-js';

export type { Session, User };

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};
