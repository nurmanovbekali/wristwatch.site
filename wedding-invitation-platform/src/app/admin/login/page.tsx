'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase hali ulanmagan. .env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY qiymatlarini kiriting."
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError('Email yoki parol noto\'g\'ri.');
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen-safe items-center justify-center bg-[#0d0d0e] px-6 text-[#f7f3ec]">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-2 text-center" style={{ color: 'rgba(247,243,236,0.62)' }}>
          Admin
        </p>
        <h1 className="mb-8 text-center font-display text-3xl">Boshqaruv paneliga kirish</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[44px] rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#c9a875]"
          />
          <input
            type="password"
            required
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[44px] rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#c9a875]"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] rounded-md bg-[#c9a875] px-4 py-3 text-sm font-medium text-[#0d0d0e] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </main>
  );
}
