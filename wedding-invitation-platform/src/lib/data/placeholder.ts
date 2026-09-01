import { Wedding } from '../types';

/**
 * Placeholder invitation used for local development, the admin
 * "new invitation" default, and the design preview when no
 * Supabase project is connected yet. No real couple's data.
 */
export const PLACEHOLDER_WEDDING: Wedding = {
  id: 'placeholder',
  owner_id: 'placeholder-owner',
  slug: 'demo',

  groom_name: 'AZIZ',
  bride_name: 'MALIKA',
  subtitle: "Bizning to'y kunimizga marhamat",
  wedding_date: '2026-10-12',
  wedding_time: '17:00',
  timezone: 'Asia/Tashkent',

  venue_name: 'Bogʻ restorani',
  address: 'Toshkent shahri, Yunusobod tumani',
  map_url: 'https://maps.google.com',
  nav_button_text: 'Xaritada ochish',

  cover_image: null,
  intro_video: null,
  background_video: null,

  theme: 'champagne',
  accent_color: '#c9a875',
  background_style: 'minimal',

  music_url: null,
  music_enabled: false,
  music_autoplay: false,

  invitation_text:
    "Sizni turmush qurish marosimimizga taklif qilishdan mamnunmiz. Ushbu quvonchli kunni siz bilan baham ko'rishni orzu qilamiz.",
  footer_text: 'Sizni kutamiz',

  telegram: null,
  whatsapp: null,
  phone: null,

  countdown_enabled: true,

  seo_title: 'Aziz & Malika — To\'y taklifnomasi',
  seo_description: "Bizning to'y kunimizga qo'shiling",
  og_image: null,

  published: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),

  gallery_images: [],
};
