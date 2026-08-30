import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo.jsx'

const SESSION_KEY = 'ww_intro_seen'

export default function IntroLoader({ onFinish }) {
  const videoRef = useRef(null)
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!visible) {
      onFinish()
      return
    }
    // Ba'zi mobil brauzerlar (ayniqsa ilova-ichi brauzerlar — Instagram, Telegram va h.k.)
    // `autoPlay` atributini e'tiborsiz qoldiradi. Shuning uchun dasturiy ravishda ham play qilamiz.
    const el = videoRef.current
    if (el) {
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          // Avtoplay bloklangan bo'lsa — pastdagi fallback timer baribir intro'ni yopadi
        })
      }
    }
    // Video haqiqiy davomiyligidan 2 soniya ortiqni kutamiz (agar "onEnded" ishlamasa)
    function setupFallback() {
      const duration = el?.duration
      const ms = duration && isFinite(duration) ? duration * 1000 + 1500 : 6000
      return setTimeout(finish, ms)
    }
    let fallbackTimer = setTimeout(setupFallback, 300)
    return () => clearTimeout(fallbackTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function finish() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
    setTimeout(onFinish, 900)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            exit={{ scale: 1.15, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease' }}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              onCanPlay={() => setReady(true)}
              onEnded={finish}
              onError={finish}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: ready ? 1 : 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
          >
            <Logo className="text-3xl sm:text-5xl text-mist drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]" />
          </motion.div>

          <motion.button
            onClick={finish}
            className="absolute bottom-8 right-8 text-xs tracking-widest2 uppercase text-steel hover:text-mist transition-colors border border-line hover:border-steelLight px-4 py-2 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            exit={{ opacity: 0 }}
          >
            O'tkazib yuborish
          </motion.button>

          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-line border-t-steelLight animate-spin" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
