'use client';

import { useState } from 'react';

interface ShareMenuProps {
  url: string;
  title: string;
}

export function ShareMenu({ url, title }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      setOpen((v) => !v);
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-30">
      <button
        onClick={nativeShare}
        aria-label="Ulashish"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-bg)]/70 text-[var(--color-text)] backdrop-blur-sm transition-colors hover:border-[var(--color-accent)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" /><line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-14 left-0 flex flex-col gap-2 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-bg-elevated)] p-3 text-sm">
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-2 py-2 text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            Telegram
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-2 py-2 text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            WhatsApp
          </a>
          <button
            onClick={copyLink}
            className="min-h-[44px] px-2 py-2 text-left text-[var(--color-text)] hover:text-[var(--color-accent)]"
          >
            {copied ? 'Nusxalandi ✓' : 'Linkni nusxalash'}
          </button>
        </div>
      )}
    </div>
  );
}
