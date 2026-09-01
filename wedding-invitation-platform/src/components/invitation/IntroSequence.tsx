'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface IntroSequenceProps {
  groomName: string;
  brideName: string;
  onComplete: () => void;
  onMusicStart?: () => void;
}

/**
 * One coherent cinematic timeline, not a grab-bag of effects:
 * dark → soft light reveal → grain → initials → morph to full
 * names → hand off to the page. Every stage has a narrative reason
 * to exist; nothing spins, bounces, or flashes for its own sake.
 *
 * A single tap opens the experience — this satisfies both the
 * "no blank autoplay" requirement and mobile audio-autoplay policy
 * in one motion.
 */
export function IntroSequence({ groomName, brideName, onComplete, onMusicStart }: IntroSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<'gate' | 'reveal' | 'done'>('gate');

  const groomInitial = groomName.trim().charAt(0).toUpperCase() || 'A';
  const brideInitial = brideName.trim().charAt(0).toUpperCase() || 'M';

  const beginReveal = () => {
    setStage('reveal');
    onMusicStart?.();
  };

  useEffect(() => {
    if (stage !== 'reveal') return;

    // Reduced motion: skip straight to content, no timed sequence.
    if (reducedMotion) {
      const t = setTimeout(() => {
        setStage('done');
        onComplete();
      }, 300);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 4200);
    return () => clearTimeout(t);
  }, [stage, reducedMotion, onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]"
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* very subtle grain, present through the whole sequence */}
          <div className="grain absolute inset-0" />

          {stage === 'gate' && (
            <motion.button
              onClick={beginReveal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="group flex flex-col items-center gap-6"
              aria-label="Taklifnomani ochish"
            >
              <span className="eyebrow">Taklifnoma</span>
              <span className="name-display text-[var(--color-text)]">
                {groomInitial}
                <span className="mx-2 text-[var(--color-accent)]">&amp;</span>
                {brideInitial}
              </span>
              <span className="mt-4 rounded-full border border-[var(--color-hairline)] px-6 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]">
                Taklifnomani ochish
              </span>
            </motion.button>
          )}

          {stage === 'reveal' && !reducedMotion && (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              {/* 0.5s soft light reveal */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, var(--color-accent-soft), transparent 60%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4] }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 1.5s elegant line */}
              <motion.div
                className="absolute h-px bg-[var(--color-accent)]"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 120, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* 2.0s initials reveal, 2.8s morph to full names */}
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.0, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key="initials"
                    className="name-display absolute"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 1, 0] }}
                    transition={{ duration: 1.0, delay: 1.2, times: [0, 0.6, 1] }}
                  >
                    {groomInitial}
                    <span className="mx-2 text-[var(--color-accent)]">&amp;</span>
                    {brideInitial}
                  </motion.span>
                  <motion.span
                    key="fullnames"
                    className="name-display text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {groomName}
                    <br />
                    <span className="text-[var(--color-accent)]">&amp;</span>
                    <br />
                    {brideName}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
