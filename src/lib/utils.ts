import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

const DATETIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const TIMEZONE_FORMAT = new Intl.DateTimeFormat('en-AU', { timeZoneName: 'short' });

export function formatDate(value: string | Date): string {
  const d = new Date(value);
  const tz = TIMEZONE_FORMAT.formatToParts(d).find((p) => p.type === 'timeZoneName')?.value;
  return `${DATETIME_FORMAT.format(d)}${tz ? ` (${tz})` : ''}`;
}
