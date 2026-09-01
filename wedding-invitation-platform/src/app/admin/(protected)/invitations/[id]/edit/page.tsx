'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Wedding, WeddingDraft } from '@/lib/types';
import { PLACEHOLDER_WEDDING } from '@/lib/data/placeholder';
import { InvitationEditor } from '@/components/admin/InvitationEditor';
import { LivePreviewFrame } from '@/components/admin/LivePreviewFrame';
import { RsvpStats } from '@/components/admin/RsvpStats';

export default function EditInvitationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [saved, setSaved] = useState<Wedding | null>(null);
  const [draft, setDraft] = useState<WeddingDraft | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setSaved(PLACEHOLDER_WEDDING);
        setDraft(PLACEHOLDER_WEDDING);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from('weddings').select('*, gallery_images(*)').eq('id', params.id).single();
      if (data) {
        setSaved(data as Wedding);
        setDraft(data as Wedding);
      }
    }
    load();
  }, [params.id]);

  function handleChange(patch: Partial<WeddingDraft>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function discard() {
    if (saved) setDraft(saved);
  }

  async function save() {
    if (!draft || !isSupabaseConfigured) return;
    setSaving(true);
    const supabase = createClient();
    const { gallery_images, ...updatable } = draft as Wedding;
    const { data, error } = await supabase
      .from('weddings')
      .update(updatable)
      .eq('id', params.id)
      .select('*, gallery_images(*)')
      .single();
    setSaving(false);
    if (!error && data) {
      setSaved(data as Wedding);
      setDraft(data as Wedding);
    }
  }

  if (!draft) {
    return <div className="p-8 text-white/50">Yuklanmoqda...</div>;
  }

  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const previewWedding = { ...(draft as Wedding), id: saved?.id ?? 'placeholder' };

  return (
    <div className="flex h-screen flex-col text-[#f7f3ec]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/admin/invitations" className="text-sm text-white/50 hover:text-white">
            ← Invitations
          </Link>
          <span className="text-sm">
            {draft.groom_name || '...'} &amp; {draft.bride_name || '...'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobilePreview((v) => !v)}
            className="min-h-[36px] rounded-md border border-white/10 px-3 text-xs md:hidden"
          >
            {showMobilePreview ? 'Editorga qaytish' : 'Preview'}
          </button>
          {saved && (
            <a
              href={`/invite/${saved.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-[36px] items-center rounded-md border border-white/10 px-3 text-xs md:flex"
            >
              Preview as guest
            </a>
          )}
          <button
            onClick={discard}
            disabled={!isDirty}
            className="min-h-[36px] rounded-md border border-white/10 px-3 text-xs disabled:opacity-30"
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={!isDirty || saving}
            className="min-h-[36px] rounded-md bg-[#c9a875] px-4 text-xs font-medium text-[#0d0d0e] disabled:opacity-40"
          >
            {saving ? 'Saqlanmoqda...' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-full overflow-y-auto p-6 md:w-1/2 ${showMobilePreview ? 'hidden md:block' : ''}`}>
          <InvitationEditor draft={draft} onChange={handleChange} />
          {saved && (
            <div className="mt-6">
              <RsvpStats weddingId={saved.id} />
            </div>
          )}
        </div>
        <div className={`w-full border-l border-white/10 md:w-1/2 ${showMobilePreview ? '' : 'hidden md:block'}`}>
          <LivePreviewFrame wedding={previewWedding as Wedding} />
        </div>
      </div>
    </div>
  );
}
