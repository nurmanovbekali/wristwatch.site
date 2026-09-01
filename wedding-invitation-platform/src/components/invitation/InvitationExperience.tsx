'use client';

import { useRef, useState } from 'react';
import { Wedding } from '@/lib/types';
import { themeStyle } from '@/lib/themes';
import { IntroSequence } from './IntroSequence';
import { HeroSection } from './HeroSection';
import { InvitationMessageSection } from './InvitationMessageSection';
import { DateVenueSection } from './DateVenueSection';
import { CountdownSection } from './CountdownSection';
import { GallerySection } from './GallerySection';
import { RsvpSection } from './RsvpSection';
import { ThankYouSection } from './ThankYouSection';
import { MusicToggle } from './MusicToggle';
import { ShareMenu } from './ShareMenu';

interface InvitationExperienceProps {
  wedding: Wedding;
  /** When true, skips the intro and shows an "exit preview" bar — used by admin preview mode. */
  isAdminPreview?: boolean;
  shareUrl?: string;
}

export function InvitationExperience({ wedding, isAdminPreview, shareUrl }: InvitationExperienceProps) {
  const [introDone, setIntroDone] = useState(Boolean(isAdminPreview));
  const audioRef = useRef<HTMLAudioElement>(null);

  const style = themeStyle(wedding.theme, wedding.accent_color);
  const title = `${wedding.groom_name} & ${wedding.bride_name}`;

  return (
    <div style={style} className="min-h-screen-safe bg-[var(--color-bg)]">
      {isAdminPreview && (
        <div className="fixed top-0 z-50 flex w-full items-center justify-between bg-black px-4 py-2 text-xs text-white safe-top">
          <span>Admin preview rejimi — mehmonlar bu panelni ko'rmaydi</span>
          <a href={`/admin/invitations/${wedding.id}/edit`} className="underline">
            Preview'dan chiqish
          </a>
        </div>
      )}

      {!introDone && (
        <IntroSequence
          groomName={wedding.groom_name || 'AZIZ'}
          brideName={wedding.bride_name || 'MALIKA'}
          onComplete={() => setIntroDone(true)}
          onMusicStart={() => {
            if (wedding.music_enabled && wedding.music_url) {
              audioRef.current?.play().catch(() => {});
            }
          }}
        />
      )}

      <main className={isAdminPreview ? 'pt-8' : ''}>
        <HeroSection wedding={wedding} />
        <InvitationMessageSection wedding={wedding} />
        <DateVenueSection wedding={wedding} />
        <CountdownSection wedding={wedding} />
        <GallerySection images={wedding.gallery_images ?? []} />
        <RsvpSection weddingId={wedding.id} />
        <ThankYouSection wedding={wedding} />
      </main>

      {wedding.music_enabled && wedding.music_url && (
        <MusicToggle ref={audioRef} musicUrl={wedding.music_url} />
      )}
      {shareUrl && <ShareMenu url={shareUrl} title={title} />}
    </div>
  );
}
