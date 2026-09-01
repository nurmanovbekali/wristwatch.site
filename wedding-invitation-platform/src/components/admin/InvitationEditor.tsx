'use client';

import { useState } from 'react';
import { WeddingDraft, ThemeName } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import { cx } from '@/lib/utils';

const TABS = [
  'General',
  'Location',
  'Media',
  'Design',
  'Audio',
  'Text',
  'Social',
  'Countdown',
  'SEO',
] as const;

type Tab = (typeof TABS)[number];

interface InvitationEditorProps {
  draft: WeddingDraft;
  onChange: (patch: Partial<WeddingDraft>) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-white/50">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'min-h-[44px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a875]';

export function InvitationEditor({ draft, onChange }: InvitationEditorProps) {
  const [tab, setTab] = useState<Tab>('General');

  function set<K extends keyof WeddingDraft>(key: K, value: WeddingDraft[K]) {
    onChange({ [key]: value } as Partial<WeddingDraft>);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cx(
              'min-h-[36px] rounded-md px-3 text-xs uppercase tracking-wide transition-colors',
              tab === t ? 'bg-[#c9a875] text-[#0d0d0e]' : 'text-white/50 hover:bg-white/5'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kuyov ismi">
            <input className={inputClass} value={draft.groom_name} onChange={(e) => set('groom_name', e.target.value)} />
          </Field>
          <Field label="Kelin ismi">
            <input className={inputClass} value={draft.bride_name} onChange={(e) => set('bride_name', e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <input className={inputClass} value={draft.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
          </Field>
          <Field label="Sana">
            <input type="date" className={inputClass} value={draft.wedding_date ?? ''} onChange={(e) => set('wedding_date', e.target.value)} />
          </Field>
          <Field label="Vaqt">
            <input type="time" className={inputClass} value={draft.wedding_time ?? ''} onChange={(e) => set('wedding_time', e.target.value)} />
          </Field>
          <Field label="Timezone">
            <input className={inputClass} value={draft.timezone} onChange={(e) => set('timezone', e.target.value)} />
          </Field>
          <Field label="Nashr holati">
            <select
              className={inputClass}
              value={draft.published ? 'published' : 'draft'}
              onChange={(e) => set('published', e.target.value === 'published')}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
      )}

      {tab === 'Location' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue nomi">
            <input className={inputClass} value={draft.venue_name} onChange={(e) => set('venue_name', e.target.value)} />
          </Field>
          <Field label="Manzil">
            <input className={inputClass} value={draft.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="Google Maps URL">
            <input className={inputClass} value={draft.map_url} onChange={(e) => set('map_url', e.target.value)} />
          </Field>
          <Field label="Navigatsiya tugmasi matni">
            <input className={inputClass} value={draft.nav_button_text} onChange={(e) => set('nav_button_text', e.target.value)} />
          </Field>
        </div>
      )}

      {tab === 'Media' && (
        <div className="grid grid-cols-1 gap-4">
          <Field label="Cover image URL">
            <input className={inputClass} value={draft.cover_image ?? ''} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Intro video URL">
            <input className={inputClass} value={draft.intro_video ?? ''} onChange={(e) => set('intro_video', e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Background video URL">
            <input className={inputClass} value={draft.background_video ?? ''} onChange={(e) => set('background_video', e.target.value)} placeholder="https://..." />
          </Field>
          <p className="text-xs text-white/40">
            Gallery rasmlarini boshqarish uchun quyidagi "Gallery" panelidan foydalaning (Supabase Storage'ga yuklanadi).
          </p>
        </div>
      )}

      {tab === 'Design' && (
        <div className="flex flex-col gap-5">
          <Field label="Theme">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeName[]).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => set('theme', themeKey)}
                  className={cx(
                    'flex min-h-[44px] items-center gap-2 rounded-md border px-3 py-2 text-xs',
                    draft.theme === themeKey ? 'border-[#c9a875] text-[#c9a875]' : 'border-white/10 text-white/60'
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: THEMES[themeKey]['--color-accent'] }}
                  />
                  {THEMES[themeKey].label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Accent rang (override)">
            <input type="color" className="h-11 w-20 rounded-md border border-white/10 bg-transparent" value={draft.accent_color} onChange={(e) => set('accent_color', e.target.value)} />
          </Field>
        </div>
      )}

      {tab === 'Audio' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Music URL">
            <input className={inputClass} value={draft.music_url ?? ''} onChange={(e) => set('music_url', e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Musiqa yoqilgan">
            <select className={inputClass} value={draft.music_enabled ? 'on' : 'off'} onChange={(e) => set('music_enabled', e.target.value === 'on')}>
              <option value="off">O'chirilgan</option>
              <option value="on">Yoqilgan</option>
            </select>
          </Field>
        </div>
      )}

      {tab === 'Text' && (
        <div className="grid grid-cols-1 gap-4">
          <Field label="Taklifnoma matni">
            <textarea rows={4} className={inputClass} value={draft.invitation_text} onChange={(e) => set('invitation_text', e.target.value)} />
          </Field>
          <Field label="Footer matni">
            <input className={inputClass} value={draft.footer_text} onChange={(e) => set('footer_text', e.target.value)} />
          </Field>
        </div>
      )}

      {tab === 'Social' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Telegram">
            <input className={inputClass} value={draft.telegram ?? ''} onChange={(e) => set('telegram', e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={inputClass} value={draft.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} />
          </Field>
          <Field label="Telefon">
            <input className={inputClass} value={draft.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </Field>
        </div>
      )}

      {tab === 'Countdown' && (
        <Field label="Countdown">
          <select
            className={inputClass}
            value={draft.countdown_enabled ? 'on' : 'off'}
            onChange={(e) => set('countdown_enabled', e.target.value === 'on')}
          >
            <option value="on">Yoqilgan</option>
            <option value="off">O'chirilgan</option>
          </select>
        </Field>
      )}

      {tab === 'SEO' && (
        <div className="grid grid-cols-1 gap-4">
          <Field label="Page title">
            <input className={inputClass} value={draft.seo_title ?? ''} onChange={(e) => set('seo_title', e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea rows={2} className={inputClass} value={draft.seo_description ?? ''} onChange={(e) => set('seo_description', e.target.value)} />
          </Field>
          <Field label="OG image URL">
            <input className={inputClass} value={draft.og_image ?? ''} onChange={(e) => set('og_image', e.target.value)} />
          </Field>
        </div>
      )}
    </div>
  );
}
