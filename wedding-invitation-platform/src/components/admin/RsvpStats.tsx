'use client';

import { useEffect, useState } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { computeRsvpStats } from '@/lib/utils';
import { RsvpEntry } from '@/lib/types';

export function RsvpStats({ weddingId }: { weddingId: string }) {
  const [entries, setEntries] = useState<RsvpEntry[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured || weddingId === 'placeholder') return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('rsvps')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('created_at', { ascending: false });
      setEntries((data ?? []) as RsvpEntry[]);
    }
    load();
  }, [weddingId]);

  const stats = computeRsvpStats(entries);

  return (
    <div className="rounded-lg border border-white/10 p-4">
      <h3 className="mb-3 text-sm font-medium text-white/70">RSVP statistikasi</h3>
      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-emerald-400">Confirmed: {stats.confirmed}</span>
        <span className="text-red-400">Declined: {stats.declined}</span>
        <span className="text-white/40">Pending: {stats.pending}</span>
      </div>
      <div className="max-h-48 overflow-y-auto text-xs text-white/60">
        {entries.length === 0 && <p>Hali javob yo'q.</p>}
        {entries.map((e) => (
          <div key={e.id} className="flex justify-between border-t border-white/5 py-1.5 first:border-t-0">
            <span>{e.guest_name} {e.status === 'confirmed' && `(${e.guest_count})`}</span>
            <span className={e.status === 'confirmed' ? 'text-emerald-400' : e.status === 'declined' ? 'text-red-400' : 'text-white/40'}>
              {e.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
