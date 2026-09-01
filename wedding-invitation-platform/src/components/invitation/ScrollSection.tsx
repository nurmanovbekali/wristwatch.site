'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cx } from '@/lib/utils';

interface ScrollSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
}

/**
 * Shared scroll-reveal wrapper for every section below the hero.
 * One consistent motion signature (fade + rise + soft scale) keeps
 * the visual rhythm intact instead of a different trick per section.
 */
export function ScrollSection({ id, children, className, eyebrow }: ScrollSectionProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.15);

  return (
    <section
      id={id}
      ref={ref}
      className={cx('relative mx-auto max-w-2xl px-6 py-24 md:py-32', className)}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-4 text-center"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
