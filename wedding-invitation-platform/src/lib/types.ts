export type ThemeName =
  | 'champagne'
  | 'emerald'
  | 'burgundy'
  | 'midnight'
  | 'ivory'
  | 'rose';

export interface GalleryImage {
  id: string;
  wedding_id: string;
  image_url: string;
  sort_order: number;
}

export interface Wedding {
  id: string;
  owner_id: string;
  slug: string;

  groom_name: string;
  bride_name: string;
  subtitle: string;
  wedding_date: string | null;
  wedding_time: string | null;
  timezone: string;

  venue_name: string;
  address: string;
  map_url: string;
  nav_button_text: string;

  cover_image: string | null;
  intro_video: string | null;
  background_video: string | null;

  theme: ThemeName;
  accent_color: string;
  background_style: string;

  music_url: string | null;
  music_enabled: boolean;
  music_autoplay: boolean;

  invitation_text: string;
  footer_text: string;

  telegram: string | null;
  whatsapp: string | null;
  phone: string | null;

  countdown_enabled: boolean;

  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;

  published: boolean;
  created_at: string;
  updated_at: string;

  gallery_images?: GalleryImage[];
}

export type WeddingDraft = Omit<
  Wedding,
  'id' | 'owner_id' | 'created_at' | 'updated_at' | 'gallery_images'
>;

export interface RsvpEntry {
  id: string;
  wedding_id: string;
  guest_name: string;
  status: 'confirmed' | 'declined' | 'pending';
  guest_count: number;
  message: string;
  created_at: string;
}

export interface RsvpStats {
  confirmed: number;
  declined: number;
  pending: number;
}
