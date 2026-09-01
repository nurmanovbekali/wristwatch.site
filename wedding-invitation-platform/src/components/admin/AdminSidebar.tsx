'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cx } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Overview' },
  { href: '/admin/invitations', label: 'Invitations' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col justify-between border-r border-white/10 bg-[#0d0d0e] px-4 py-6 text-[#f7f3ec]">
      <div>
        <p className="mb-8 px-2 font-display text-lg">Admin CMS</p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                'min-h-[44px] rounded-md px-3 py-2.5 text-sm transition-colors flex items-center',
                pathname.startsWith(item.href)
                  ? 'bg-white/10 text-[#c9a875]'
                  : 'text-white/70 hover:bg-white/5'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="min-h-[44px] rounded-md px-3 py-2.5 text-left text-sm text-white/50 hover:bg-white/5 hover:text-white"
      >
        Chiqish
      </button>
    </aside>
  );
}
