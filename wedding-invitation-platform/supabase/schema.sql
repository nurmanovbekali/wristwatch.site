-- ============================================================
-- Wedding Invitation Platform — Supabase schema
-- Run this in the Supabase SQL editor on a fresh project.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- WEDDINGS (one row per invitation)
-- ------------------------------------------------------------
create table if not exists public.weddings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  slug text unique not null,

  -- GENERAL
  groom_name text not null default '',
  bride_name text not null default '',
  subtitle text default '',
  wedding_date date,
  wedding_time time,
  timezone text default 'Asia/Tashkent',

  -- LOCATION
  venue_name text default '',
  address text default '',
  map_url text default '',
  nav_button_text text default 'Xaritada ochish',

  -- MEDIA
  cover_image text,
  intro_video text,
  background_video text,

  -- DESIGN
  theme text default 'champagne',
  accent_color text default '#c9a875',
  background_style text default 'minimal',

  -- AUDIO
  music_url text,
  music_enabled boolean default false,
  music_autoplay boolean default false,

  -- TEXT
  invitation_text text default '',
  footer_text text default '',

  -- SOCIAL
  telegram text,
  whatsapp text,
  phone text,

  -- COUNTDOWN
  countdown_enabled boolean default true,

  -- SEO / SHARE
  seo_title text,
  seo_description text,
  og_image text,

  -- STATE
  published boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists weddings_owner_id_idx on public.weddings(owner_id);
create index if not exists weddings_slug_idx on public.weddings(slug);

-- ------------------------------------------------------------
-- GALLERY IMAGES
-- ------------------------------------------------------------
create table if not exists public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references public.weddings(id) on delete cascade not null,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists gallery_images_wedding_id_idx on public.gallery_images(wedding_id);

-- ------------------------------------------------------------
-- RSVPS
-- ------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references public.weddings(id) on delete cascade not null,
  guest_name text not null,
  status text not null check (status in ('confirmed', 'declined', 'pending')) default 'pending',
  guest_count int default 1,
  message text default '',
  created_at timestamptz default now()
);

create index if not exists rsvps_wedding_id_idx on public.rsvps(wedding_id);

-- ------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists weddings_set_updated_at on public.weddings;
create trigger weddings_set_updated_at
  before update on public.weddings
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.weddings enable row level security;
alter table public.gallery_images enable row level security;
alter table public.rsvps enable row level security;

-- WEDDINGS: public can read only published rows
create policy "public can read published weddings"
  on public.weddings for select
  using (published = true);

-- WEDDINGS: owner has full access to their own rows (including drafts)
create policy "owner full access to own weddings"
  on public.weddings for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- GALLERY: public can read images belonging to a published wedding
create policy "public can read gallery of published weddings"
  on public.gallery_images for select
  using (
    exists (
      select 1 from public.weddings w
      where w.id = wedding_id and w.published = true
    )
  );

-- GALLERY: owner manages their own gallery
create policy "owner manages own gallery"
  on public.gallery_images for all
  using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid())
  );

-- RSVPS: anyone can INSERT an rsvp against a published wedding (guests are not authenticated)
create policy "anyone can submit rsvp to published wedding"
  on public.rsvps for insert
  with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.published = true)
  );

-- RSVPS: only the owner can read/manage responses (guest data is never public)
create policy "owner reads own rsvps"
  on public.rsvps for select
  using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid())
  );

create policy "owner manages own rsvps"
  on public.rsvps for update
  using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid())
  );

create policy "owner deletes own rsvps"
  on public.rsvps for delete
  using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.owner_id = auth.uid())
  );

-- ============================================================
-- STORAGE (run once — buckets for cover images, gallery, video, music)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', true)
on conflict (id) do nothing;

create policy "public can view wedding media"
  on storage.objects for select
  using (bucket_id = 'wedding-media');

create policy "authenticated users can upload wedding media"
  on storage.objects for insert
  with check (bucket_id = 'wedding-media' and auth.role() = 'authenticated');

create policy "owners can update their own uploads"
  on storage.objects for update
  using (bucket_id = 'wedding-media' and auth.role() = 'authenticated');

create policy "owners can delete their own uploads"
  on storage.objects for delete
  using (bucket_id = 'wedding-media' and auth.role() = 'authenticated');
