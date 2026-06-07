import type { ReactNode } from 'react';

export const Body = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-[100vh]">
      {children}
    </div>
  );
};
