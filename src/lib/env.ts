export const env = {
  appUrl: import.meta.env.VITE_APP_URL ?? 'http://localhost:3000',
} as const;
