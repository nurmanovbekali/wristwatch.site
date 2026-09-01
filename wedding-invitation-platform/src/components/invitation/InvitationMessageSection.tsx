import { ScrollSection } from './ScrollSection';
import { Wedding } from '@/lib/types';

export function InvitationMessageSection({ wedding }: { wedding: Wedding }) {
  if (!wedding.invitation_text) return null;
  return (
    <ScrollSection id="message" eyebrow="Taklifnoma">
      <p className="text-center font-display text-xl leading-relaxed text-[var(--color-text)] md:text-2xl">
        {wedding.invitation_text}
      </p>
    </ScrollSection>
  );
}
