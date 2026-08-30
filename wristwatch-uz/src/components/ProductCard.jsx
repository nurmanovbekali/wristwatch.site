import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'
import { formatPrice } from '../lib/utils'

export default function ProductCard({ product, index = 0 }) {
  const { lang } = useLang()
  const name = product[`name_${lang}`] || product.name_uz

  // Sichqoncha pozitsiyasiga qarab yengil 3D "tilt" effekti
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })
  const glowX = useTransform(mx, [0, 1], ['0%', '100%'])
  const glowY = useTransform(my, [0, 1], ['0%', '100%'])

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  function handleLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY }}
          className="tilt-card relative overflow-hidden rounded-2xl bg-graphite aspect-[4/5]"
        >
          <img
            src={product.image_url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.opacity = '0'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(201,204,209,0.25), transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-mist/10 pointer-events-none" />
        </motion.div>
        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg leading-tight">{name}</h3>
            <p className="text-xs uppercase tracking-widest2 text-mist/40 mt-1">{product.category}</p>
          </div>
          <p className="text-steelLight font-medium whitespace-nowrap">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
