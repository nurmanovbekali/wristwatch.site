'use client';

import { motion } from 'framer-motion';
import { Wedding } from '@/lib/types';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T00:00:00`);
  return date
    .toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
    .toUpperCase();
}

export function HeroSection({ wedding }: { wedding: Wedding }) {
  return (
    <section className="min-h-screen-safe relative flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      {wedding.cover_image && (
        <div className="absolute inset-0">
          <img
            src={wedding.cover_image}
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/60 via-transparent to-[var(--color-bg)]" />
        </div>
      )}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="eyebrow relative z-10 mb-6"
      >
        {wedding.subtitle || "Bizning to'y kunimiz"}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="name-display relative z-10 text-[var(--color-text)]"
      >
        {wedding.groom_name || 'AZIZ'}
        <span className="mx-3 text-[var(--color-accent)]">&amp;</span>
        {wedding.bride_name || 'MALIKA'}
      </motion.h1>

      {wedding.wedding_date && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-8 text-sm tracking-[0.3em] text-[var(--color-text-muted)]"
        >
          {formatDate(wedding.wedding_date)}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-[var(--color-text-muted)]"
        aria-hidden
      >
        <div className="h-8 w-px bg-current opacity-40" />
      </motion.div>
    </section>
  );
}
