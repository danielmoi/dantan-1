import { Resend } from 'resend';
import type { ReactElement } from 'react';
import { env } from '@/lib/env';

const client = new Resend(process.env.RESEND_API_KEY);

export function sendEmail(to: string, subject: string, body: ReactElement) {
  if (!env.fromEmail) throw new Error('VITE_FROM_EMAIL is not configured');
  return client.emails.send({
    from: env.fromEmail,
    to,
    subject,
    react: body,
  });
}
