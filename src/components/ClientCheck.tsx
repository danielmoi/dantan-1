import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export const ClientCheck = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
};
