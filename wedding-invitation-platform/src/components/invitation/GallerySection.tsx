'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollSection } from './ScrollSection';
import { GalleryImage } from '@/lib/types';

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <ScrollSection id="gallery" eyebrow="Rasmlar" className="max-w-4xl">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setLightboxIndex(index)}
              className="aspect-[3/4] w-[70vw] flex-shrink-0 snap-center overflow-hidden rounded-sm bg-[var(--color-bg-elevated)] md:w-auto"
            >
              <img
                src={image.image_url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </ScrollSection>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <img
              src={sorted[lightboxIndex].image_url}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
            <button
              className="absolute right-6 top-6 min-h-[44px] min-w-[44px] text-2xl text-white"
              onClick={() => setLightboxIndex(null)}
              aria-label="Yopish"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
