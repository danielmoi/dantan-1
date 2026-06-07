import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AUTH_KEY = 'auth-user';

// Read auth state outside React for use in beforeLoad (client-side only).
// For SSR-aware auth, replace localStorage with a cookie readable server-side.
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUser());

  const signIn = (user: User) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const DEMO_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'user@example.com',
  avatar: '/avatar.png',
};
