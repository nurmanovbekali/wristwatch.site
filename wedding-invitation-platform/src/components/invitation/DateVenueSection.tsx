import { ScrollSection } from './ScrollSection';
import { Wedding } from '@/lib/types';

function formatFullDate(dateStr: string | null, time: string | null): { day: string; rest: string; time: string } {
  if (!dateStr) return { day: '--', rest: '', time: '' };
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.toLocaleDateString('uz-UZ', { day: 'numeric' });
  const rest = date.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' }).toUpperCase();
  return { day, rest, time: time ?? '' };
}

export function DateVenueSection({ wedding }: { wedding: Wedding }) {
  const { day, rest, time } = formatFullDate(wedding.wedding_date, wedding.wedding_time);

  return (
    <ScrollSection id="date-venue" eyebrow="Sana va manzil">
      <div className="flex flex-col items-center gap-10 text-center">
        <div>
          <div className="name-display text-[var(--color-accent)]">{day}</div>
          <div className="mt-1 text-sm tracking-[0.3em] text-[var(--color-text-muted)]">
            {rest} {time && `· ${time}`}
          </div>
        </div>

        {wedding.venue_name && (
          <div className="w-full border-t border-[var(--color-hairline)] pt-8">
            <p className="font-display text-2xl text-[var(--color-text)]">{wedding.venue_name}</p>
            {wedding.address && (
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{wedding.address}</p>
            )}
            {wedding.map_url && (
              <a
                href={wedding.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block min-h-[44px] rounded-full border border-[var(--color-hairline)] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {wedding.nav_button_text || 'Xaritada ochish'}
              </a>
            )}
          </div>
        )}
      </div>
    </ScrollSection>
  );
}
