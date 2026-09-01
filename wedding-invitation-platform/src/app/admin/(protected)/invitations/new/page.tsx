'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

export default function NewInvitationPage() {
  const router = useRouter();

  useEffect(() => {
    async function create() {
      if (!isSupabaseConfigured) return;
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      const draftName = `taklifnoma-${Date.now()}`;
      const { data, error } = await supabase
        .from('weddings')
        .insert({
          owner_id: userData.user?.id,
          slug: slugify(draftName),
          groom_name: '',
          bride_name: '',
          theme: 'champagne',
          accent_color: '#c9a875',
        })
        .select()
        .single();

      if (!error && data) {
        router.replace(`/admin/invitations/${data.id}/edit`);
      }
    }
    create();
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 text-white/60">
      {isSupabaseConfigured ? "Yaratilmoqda..." : "Supabase ulanmagan — .env.local ni to'ldiring."}
    </div>
  );
}
