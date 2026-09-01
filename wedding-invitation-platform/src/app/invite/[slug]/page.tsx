import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InvitationExperience } from '@/components/invitation/InvitationExperience';
import { PLACEHOLDER_WEDDING } from '@/lib/data/placeholder';
import { Wedding } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';

async function getWedding(slug: string): Promise<Wedding | null> {
  // No Supabase project connected yet — serve the placeholder so the
  // design can be reviewed. Real deployments will always hit the branch below.
  if (!isSupabaseConfigured) {
    return slug === 'demo' ? PLACEHOLDER_WEDDING : null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weddings')
    .select('*, gallery_images(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data as Wedding;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const wedding = await getWedding(params.slug);
  if (!wedding) return { title: 'Taklifnoma topilmadi' };

  const title = wedding.seo_title || `${wedding.groom_name} & ${wedding.bride_name}`;
  const description = wedding.seo_description || wedding.invitation_text;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: wedding.og_image ? [wedding.og_image] : wedding.cover_image ? [wedding.cover_image] : [],
    },
  };
}

export default async function InvitePage({ params }: { params: { slug: string } }) {
  const wedding = await getWedding(params.slug);
  if (!wedding) notFound();

  const shareUrl = `https://example.com/invite/${wedding.slug}`;

  return <InvitationExperience wedding={wedding} shareUrl={shareUrl} />;
}
