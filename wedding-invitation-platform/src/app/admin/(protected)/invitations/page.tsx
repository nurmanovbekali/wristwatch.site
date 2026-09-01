'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Wedding } from '@/lib/types';
import { PLACEHOLDER_WEDDING } from '@/lib/data/placeholder';

export default function InvitationsListPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setWeddings([PLACEHOLDER_WEDDING]);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from('weddings').select('*').order('created_at', { ascending: false });
      setWeddings((data ?? []) as Wedding[]);
      setLoading(false);
    }
    load();
  }, []);

  async function togglePublish(w: Wedding) {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await supabase.from('weddings').update({ published: !w.published }).eq('id', w.id);
    setWeddings((prev) => prev.map((x) => (x.id === w.id ? { ...x, published: !x.published } : x)));
  }

  async function duplicate(w: Wedding) {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { id, created_at, updated_at, gallery_images, ...rest } = w;
    const { data } = await supabase
      .from('weddings')
      .insert({ ...rest, slug: `${w.slug}-copy-${Date.now()}`, published: false })
      .select()
      .single();
    if (data) setWeddings((prev) => [data as Wedding, ...prev]);
  }

  async function remove(w: Wedding) {
    if (!isSupabaseConfigured) return;
    if (!confirm(`"${w.groom_name} & ${w.bride_name}" o'chirilsinmi?`)) return;
    const supabase = createClient();
    await supabase.from('weddings').delete().eq('id', w.id);
    setWeddings((prev) => prev.filter((x) => x.id !== w.id));
  }

  function copyLink(w: Wedding) {
    const url = `${window.location.origin}/invite/${w.slug}`;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="p-8 text-[#f7f3ec]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl">Invitations</h1>
        <Link
          href="/admin/invitations/new"
          className="min-h-[44px] flex items-center rounded-md bg-[#c9a875] px-4 text-sm font-medium text-[#0d0d0e]"
        >
          + Yangi taklifnoma
        </Link>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          Supabase ulanmagan — quyida faqat demo yozuv ko'rsatilmoqda (read-only).
        </div>
      )}

      {loading ? (
        <p className="text-sm text-white/50">Yuklanmoqda...</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Juftlik</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Holat</th>
                <th className="px-4 py-3 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {weddings.map((w) => (
                <tr key={w.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{w.groom_name} &amp; {w.bride_name}</td>
                  <td className="px-4 py-3 text-white/50">/invite/{w.slug}</td>
                  <td className="px-4 py-3">
                    <span className={w.published ? 'text-emerald-400' : 'text-white/40'}>
                      {w.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3 text-xs">
                      <Link href={`/admin/invitations/${w.id}/edit`} className="min-h-[44px] flex items-center text-[#c9a875] hover:underline">
                        Tahrirlash
                      </Link>
                      <button onClick={() => togglePublish(w)} className="min-h-[44px] hover:underline">
                        {w.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => copyLink(w)} className="min-h-[44px] hover:underline">
                        Copy link
                      </button>
                      <button onClick={() => duplicate(w)} className="min-h-[44px] hover:underline">
                        Duplicate
                      </button>
                      <button onClick={() => remove(w)} className="min-h-[44px] text-red-400 hover:underline">
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
