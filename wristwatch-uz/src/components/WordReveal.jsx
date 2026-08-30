import { motion } from 'framer-motion'

// Matnni satr va so'zlarga bo'lib, har birini alohida animatsiya bilan ko'rsatadi.
// "\n" orqali qatorlarga, bo'sh joy orqali so'zlarga bo'linadi.
export default function WordReveal({ text, className = '', delay = 0, stagger = 0.07 }) {
  const lines = text.split('\n')
  let wordIndex = 0

  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-1">
          {line.split(' ').map((word, wi) => {
            const i = wordIndex++
            return (
              <motion.span
                key={wi}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: '0%' }}
                transition={{
                  duration: 0.9,
                  delay: delay + i * stagger,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block will-change-transform"
              >
                {word}
                {wi < line.split(' ').length - 1 ? '\u00A0' : ''}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
