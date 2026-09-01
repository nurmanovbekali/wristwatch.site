import { Wedding } from '@/lib/types';

export function ThankYouSection({ wedding }: { wedding: Wedding }) {
  return (
    <section className="flex flex-col items-center gap-4 px-6 py-24 text-center">
      <p className="font-display text-2xl text-[var(--color-text)]">
        {wedding.footer_text || 'Sizni kutamiz'}
      </p>
      <p className="name-display text-lg text-[var(--color-accent)]" style={{ fontSize: '1.5rem' }}>
        {wedding.groom_name} &amp; {wedding.bride_name}
      </p>
    </section>
  );
}
