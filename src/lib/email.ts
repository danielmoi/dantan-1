import { Resend } from 'resend';
import type { ReactElement } from 'react';
import { env } from '@/lib/env';

const client = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, body: ReactElement) {
  if (!env.fromEmail) throw new Error('VITE_FROM_EMAIL is not configured');
  const { error } = await client.emails.send({
    from: env.fromEmail,
    to,
    subject,
    react: body,
  });
  if (error) {
    console.error('[sendEmail] Resend error:', error);
    throw new Error(error.message);
  }
}
