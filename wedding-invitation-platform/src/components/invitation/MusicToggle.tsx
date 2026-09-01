'use client';

import { forwardRef, useState } from 'react';

interface MusicToggleProps {
  musicUrl: string;
}

export const MusicToggle = forwardRef<HTMLAudioElement, MusicToggleProps>(function MusicToggle(
  { musicUrl },
  audioRef
) {
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = (audioRef as React.RefObject<HTMLAudioElement>)?.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        /* autoplay/user-gesture restriction — button remains available to retry */
      });
    }
    setPlaying(!playing);
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Musiqani o\'chirish' : 'Musiqani yoqish'}
        className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-bg)]/70 text-[var(--color-text)] backdrop-blur-sm transition-colors hover:border-[var(--color-accent)]"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="4" height="12" /><rect x="10" y="2" width="4" height="12" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2l11 6-11 6V2z" /></svg>
        )}
      </button>
    </>
  );
});
