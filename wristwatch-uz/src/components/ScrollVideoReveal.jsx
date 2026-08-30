import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'

const STEPS = [1, 2, 3]

export default function ScrollVideoReveal() {
  const { t } = useLang()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    function onLoaded() {
      setDuration(video.duration || 0)
      // iOS Safari'da: video hech qachon play qilinmagan bo'lsa, currentTime orqali
      // "aylantirish" (scrubbing) kadrlarni umuman render qilmaydi (frame muzlab qoladi).
      // Shuning uchun bir marta beliz ovozsiz play qilib, darhol pauza qilamiz —
      // shu orqali video dekoder "isinadi" va keyingi seek'lar to'g'ri ishlaydi.
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            video.pause()
            video.currentTime = 0
          })
          .catch(() => {
            // Avtoplay bloklangan bo'lsa ham davom etamiz — hech bo'lmasa xato chiqmasin
          })
      }
    }
    video.addEventListener('loadedmetadata', onLoaded)
    if (video.readyState >= 1) onLoaded()
    return () => video.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  useEffect(() => {
    if (!duration) return
    let ticking = false

    function update() {
      const el = containerRef.current
      const video = videoRef.current
      if (!el || !video) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 0))
      const p = total > 0 ? scrolled / total : 0
      setProgress(p)
      try {
        video.currentTime = p * duration
      } catch {
        // ignore seek errors before video is fully ready
      }
      ticking = false
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchmove', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [duration])

  // Progress 0..1 ni 3 bosqichga bo'lamiz
  const activeStep = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))

  return (
    <div ref={containerRef} className="relative h-[230vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-void flex items-center" style={{ height: '100dvh' }}>
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT — changing text */}
          <div className="relative h-56 sm:h-64 order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <p className="text-xs sm:text-sm tracking-widest2 uppercase text-steelLight mb-4">
                  {t(`home.mechanism_step${activeStep + 1}_eyebrow`)}
                </p>
                <h3 className="font-display text-2xl sm:text-4xl mb-4 leading-tight">
                  {t(`home.mechanism_step${activeStep + 1}_title`)}
                </h3>
                <p className="text-mist/60 text-sm sm:text-base leading-relaxed max-w-md">
                  {t(`home.mechanism_step${activeStep + 1}_text`)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* progress dots */}
            <div className="absolute -bottom-2 left-0 flex gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeStep ? 'w-8 bg-steelLight' : 'w-1.5 bg-void/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT — scroll-scrubbed video, real showcase (fixed dark-theme blend bug) */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <motion.div
              style={{ scale: 0.94 + progress * 0.06 }}
              className="relative w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60 bg-graphite ring-1 ring-line"
            >
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src="/watch-reveal.mp4"
                muted
                playsInline
                preload="auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-mist/10 pointer-events-none" />
              {/* rotating corner marker for technical/engineering feel */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] tracking-widest2 uppercase text-mist/70">
                <span className="h-1.5 w-1.5 rounded-full bg-steelLight animate-pulseGlow" />
                {Math.round(progress * 100)}%
              </div>
            </motion.div>
          </div>
        </div>

        {/* full-width scroll progress line at bottom of sticky section */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-line">
          <motion.div
            className="h-full bg-steelLight"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

