'use client';

import { useState } from 'react';
import { Wedding } from '@/lib/types';
import { InvitationExperience } from '@/components/invitation/InvitationExperience';
import { cx } from '@/lib/utils';

/**
 * Renders the real invitation component (not a screenshot) scaled
 * inside a phone-like frame, with a desktop/mobile toggle. Because
 * it's the same component tree as /invite/[slug], "what admin sees"
 * and "what the guest gets" can never drift apart.
 */
export function LivePreviewFrame({ wedding }: { wedding: Wedding }) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="flex h-full flex-col bg-[#0a0a0b]">
      <div className="flex items-center justify-center gap-2 border-b border-white/10 py-2">
        {(['mobile', 'desktop'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={cx(
              'min-h-[32px] rounded-md px-3 text-xs uppercase tracking-wide',
              device === d ? 'bg-[#c9a875] text-[#0d0d0e]' : 'text-white/40 hover:bg-white/5'
            )}
          >
            {d === 'mobile' ? 'Mobile' : 'Desktop'}
          </button>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <div
          className={cx(
            'h-full overflow-y-auto rounded-lg border border-white/10 shadow-2xl',
            device === 'mobile' ? 'w-[375px]' : 'w-full'
          )}
        >
          <InvitationExperience wedding={wedding} isAdminPreview />
        </div>
      </div>
    </div>
  );
}
