import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Public endpoint — guests are never authenticated. Row Level Security
 * (see supabase/schema.sql) restricts inserts to published weddings only,
 * and guests can never read back other guests' responses.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.wedding_id || !body?.guest_name || !body?.status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    // Design-review mode without a real backend — accept and no-op.
    return NextResponse.json({ ok: true, mode: 'placeholder' });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('rsvps').insert({
    wedding_id: body.wedding_id,
    guest_name: String(body.guest_name).slice(0, 200),
    status: body.status === 'declined' ? 'declined' : 'confirmed',
    guest_count: Math.min(Math.max(Number(body.guest_count) || 1, 1), 20),
    message: String(body.message ?? '').slice(0, 500),
  });

  if (error) {
    return NextResponse.json({ error: 'Could not save RSVP' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
