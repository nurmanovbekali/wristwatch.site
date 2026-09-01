import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { computeRsvpStats } from '@/lib/utils';
import { RsvpEntry, Wedding } from '@/lib/types';
import Link from 'next/link';

async function loadOverview() {
  if (!isSupabaseConfigured) {
    return { weddings: [] as Wedding[], stats: { confirmed: 0, declined: 0, pending: 0 }, configured: false };
  }

  const supabase = createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const ownerId = userData.user?.id;

  const { data: weddings } = await supabase
    .from('weddings')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  const weddingIds = (weddings ?? []).map((w) => w.id);
  let stats = { confirmed: 0, declined: 0, pending: 0 };

  if (weddingIds.length > 0) {
    const { data: rsvps } = await supabase.from('rsvps').select('*').in('wedding_id', weddingIds);
    stats = computeRsvpStats((rsvps ?? []) as RsvpEntry[]);
  }

  return { weddings: (weddings ?? []) as Wedding[], stats, configured: true };
}

export default async function DashboardPage() {
  const { weddings, stats, configured } = await loadOverview();
  const published = weddings.filter((w) => w.published).length;

  return (
    <div className="p-8 text-[#f7f3ec]">
      <h1 className="mb-1 font-display text-3xl">Overview</h1>
      <p className="mb-8 text-sm text-white/50">Barcha taklifnomalaringiz haqida umumiy ko'rinish.</p>

      {!configured && (
        <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          Supabase hali ulanmagan — bu sahifa placeholder holatda. `.env.local` faylini to'ldiring.
        </div>
      )}

      <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Jami taklifnoma" value={weddings.length} />
        <StatCard label="Nashr qilingan" value={published} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">So'nggi taklifnomalar</h2>
        <Link
          href="/admin/invitations/new"
          className="min-h-[44px] flex items-center rounded-md bg-[#c9a875] px-4 text-sm font-medium text-[#0d0d0e]"
        >
          + Yangi taklifnoma
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {weddings.slice(0, 5).map((w) => (
          <Link
            key={w.id}
            href={`/admin/invitations/${w.id}/edit`}
            className="flex items-center justify-between rounded-md border border-white/10 px-4 py-3 text-sm hover:border-[#c9a875]"
          >
            <span>{w.groom_name} &amp; {w.bride_name}</span>
            <span className={w.published ? 'text-emerald-400' : 'text-white/40'}>
              {w.published ? 'Published' : 'Draft'}
            </span>
          </Link>
        ))}
        {weddings.length === 0 && (
          <p className="text-sm text-white/40">Hali taklifnoma yaratilmagan.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 px-5 py-4">
      <div className="font-display text-3xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
