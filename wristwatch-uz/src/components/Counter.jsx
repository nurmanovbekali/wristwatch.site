import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// "500+" / "24/7" / "100%" kabi qiymatlarni qabul qiladi.
// Ichidagi raqamli qismini 0 dan boshlab animatsiya qiladi, qolgan belgilarni (+, /, %) saqlab qoladi.
export default function Counter({ value, duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(value.replace(/[0-9]/g, '0'))

  useEffect(() => {
    if (!inView) return
    const match = value.match(/[0-9]+/)
    if (!match) {
      setDisplay(value)
      return
    }
    const target = parseInt(match[0], 10)
    const prefix = value.slice(0, match.index)
    const suffix = value.slice(match.index + match[0].length)
    const start = performance.now()

    let frame
    function tick(now) {
      const p = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      const current = Math.round(target * eased)
      setDisplay(`${prefix}${current}${suffix}`)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return <span ref={ref}>{display}</span>
}
