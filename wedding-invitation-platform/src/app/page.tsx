import Link from 'next/link';

export default function RootPage() {
  return (
    <main className="flex min-h-screen-safe flex-col items-center justify-center gap-8 bg-[#0d0d0e] px-6 text-center text-[#f7f3ec]">
      <p className="eyebrow" style={{ color: 'rgba(247,243,236,0.62)' }}>
        Wedding Invitation Platform
      </p>
      <h1 className="name-display">Cinematic Invitations</h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/invite/demo"
          className="min-h-[44px] rounded-full border border-[#f7f3ec]/20 px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:border-[#c9a875] hover:text-[#c9a875]"
        >
          Demo taklifnomani ko'rish
        </Link>
        <Link
          href="/admin/login"
          className="min-h-[44px] rounded-full bg-[#c9a875] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#0d0d0e] transition-opacity hover:opacity-90"
        >
          Admin panelga kirish
        </Link>
      </div>
    </main>
  );
}
