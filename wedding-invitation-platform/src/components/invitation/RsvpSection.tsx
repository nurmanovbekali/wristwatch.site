'use client';

import { useState } from 'react';
import { ScrollSection } from './ScrollSection';

interface RsvpSectionProps {
  weddingId: string;
}

type Status = 'confirmed' | 'declined';
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function RsvpSection({ weddingId }: RsvpSectionProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('confirmed');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitState('submitting');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: weddingId,
          guest_name: name.trim(),
          status,
          guest_count: guestCount,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error('failed');
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    }
  }

  if (submitState === 'success') {
    return (
      <ScrollSection id="rsvp" eyebrow="RSVP">
        <p className="text-center font-display text-2xl text-[var(--color-accent)]">
          Rahmat! Javobingiz qabul qilindi.
        </p>
      </ScrollSection>
    );
  }

  return (
    <ScrollSection id="rsvp" eyebrow="Ishtirokingizni tasdiqlang">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-sm flex-col gap-5">
        <input
          type="text"
          required
          placeholder="Ismingiz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-[44px] border-b border-[var(--color-hairline)] bg-transparent px-1 py-3 text-center text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
        />

        <div className="flex justify-center gap-3">
          {(['confirmed', 'declined'] as Status[]).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setStatus(option)}
              className={`min-h-[44px] rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                status === option
                  ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                  : 'border-[var(--color-hairline)] text-[var(--color-text-muted)]'
              }`}
            >
              {option === 'confirmed' ? 'Kelaman' : 'Kela olmayman'}
            </button>
          ))}
        </div>

        {status === 'confirmed' && (
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-[var(--color-text-muted)]">Mehmonlar soni</span>
            <input
              type="number"
              min={1}
              max={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="min-h-[44px] w-16 border-b border-[var(--color-hairline)] bg-transparent text-center text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        )}

        <textarea
          placeholder="Izoh (ixtiyoriy)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="resize-none border-b border-[var(--color-hairline)] bg-transparent px-1 py-3 text-center text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
        />

        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="min-h-[44px] rounded-full bg-[var(--color-accent)] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitState === 'submitting' ? 'Yuborilmoqda...' : 'Yuborish'}
        </button>

        {submitState === 'error' && (
          <p className="text-center text-xs text-[var(--color-text-muted)]">
            Xatolik yuz berdi, qaytadan urinib ko'ring.
          </p>
        )}
      </form>
    </ScrollSection>
  );
}
