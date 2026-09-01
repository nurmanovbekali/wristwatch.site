'use client';

import { ScrollSection } from './ScrollSection';
import { useCountdown } from '@/hooks/useCountdown';
import { Wedding } from '@/lib/types';

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 font-display text-4xl tabular-nums text-[var(--color-text)] md:w-20 md:text-5xl">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
        {label}
      </div>
    </div>
  );
}

export function CountdownSection({ wedding }: { wedding: Wedding }) {
  const countdown = useCountdown(wedding.wedding_date, wedding.wedding_time, wedding.timezone);

  if (!wedding.countdown_enabled || !wedding.wedding_date) return null;

  return (
    <ScrollSection id="countdown" eyebrow="Sanoq">
      {countdown.isComplete ? (
        <p className="text-center font-display text-3xl text-[var(--color-accent)]">
          Bugun bizning kunimiz 🤍
        </p>
      ) : (
        <div className="flex items-start justify-center gap-4 md:gap-10">
          <Unit value={countdown.days} label="Kun" />
          <Unit value={countdown.hours} label="Soat" />
          <Unit value={countdown.minutes} label="Daqiqa" />
          <Unit value={countdown.seconds} label="Soniya" />
        </div>
      )}
    </ScrollSection>
  );
}
