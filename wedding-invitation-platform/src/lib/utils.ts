import { RsvpEntry, RsvpStats } from './types';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function computeRsvpStats(entries: RsvpEntry[]): RsvpStats {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.status] += 1;
      return acc;
    },
    { confirmed: 0, declined: 0, pending: 0 } as RsvpStats
  );
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:mm) into
 * a Date understood to be in the given IANA timezone, returned as
 * a UTC epoch millis value for stable countdown math.
 */
export function weddingDateTimeToEpoch(
  date: string | null,
  time: string | null,
  timezone: string
): number | null {
  if (!date) return null;
  const timePart = time ?? '00:00';
  // Construct an ISO-like string and let the runtime interpret it,
  // then adjust by the timezone offset at that instant.
  const naive = new Date(`${date}T${timePart}:00`);
  if (Number.isNaN(naive.getTime())) return null;

  try {
    const tzDate = new Date(
      naive.toLocaleString('en-US', { timeZone: timezone })
    );
    const utcDate = new Date(
      naive.toLocaleString('en-US', { timeZone: 'UTC' })
    );
    const offset = utcDate.getTime() - tzDate.getTime();
    return naive.getTime() + offset;
  } catch {
    return naive.getTime();
  }
}
