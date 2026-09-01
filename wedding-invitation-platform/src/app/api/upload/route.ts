import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'audio/mpeg', 'audio/mp4'];

/**
 * Admin-only upload endpoint. Requires an authenticated session
 * (enforced by middleware for /admin/*, and re-checked here since
 * this is an API route reachable independently of that middleware
 * matcher). Validates MIME type and size before touching storage.
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 });
  }

  const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
  const { error } = await supabase.storage.from('wedding-media').upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from('wedding-media').getPublicUrl(path);
  return NextResponse.json({ url: publicUrlData.publicUrl });
}
