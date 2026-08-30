import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard.jsx'
import ScrollVideoReveal from '../components/ScrollVideoReveal.jsx'
import Marquee from '../components/Marquee.jsx'
import Counter from '../components/Counter.jsx'
import WordReveal from '../components/WordReveal.jsx'

export default function Home() {
  const { t } = useLang()
  const [featured, setFeatured] = useState([])
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 800], [0, 220])
  const heroFade = useTransform(scrollY, [0, 500], [1, 0])
  const wordParallax = useTransform(scrollY, [0, 800], [0, -120])

  useEffect(() => {
    let active = true
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active && data) setFeatured(data)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-void text-mist px-5" style={{ minHeight: '92dvh' }}>
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #8A8D91 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Kinetic faint background word */}
        <motion.div
          style={{ y: wordParallax }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span className="kinetic-word text-[22vw] leading-none whitespace-nowrap">WRISTWATCH</span>
        </motion.div>

        {/* Floating gradient orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full animate-floatSlow"
          style={{ background: 'radial-gradient(circle, rgba(138,141,145,0.16) 0%, transparent 70%)' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="absolute right-[8%] top-[18%] w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] rounded-full animate-floatSlower pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,204,209,0.16) 0%, transparent 70%)' }}
        />
        <div className="grain-overlay" />

        <motion.div style={{ y: heroParallax, opacity: heroFade }} className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-sm tracking-widest2 uppercase text-steelLight mb-6"
          >
            {t('hero.eyebrow')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] whitespace-pre-line steel-gradient-text animate-shimmer"
          >
            <WordReveal text={t('hero.title')} delay={0.3} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-7 text-base sm:text-lg text-mist/60 max-w-xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-10"
          >
            <Link to="/catalog" className="group relative inline-block">
              <motion.span
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative inline-flex items-center gap-2 bg-mist text-void px-9 py-4 rounded-full text-sm tracking-widest2 uppercase shadow-lg shadow-black/40 overflow-hidden"
              >
                <span
                  className="absolute inset-0 bg-gradient-to-r from-steel via-steelLight to-steel opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundSize: '200% auto' }}
                />
                <span className="relative group-hover:text-void transition-colors duration-500">{t('hero.cta')}</span>
                <motion.span
                  className="relative group-hover:text-void transition-colors duration-500"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mist/30 text-xs tracking-widest2 uppercase"
        >
          {t('hero.scroll')}
        </motion.div>
      </section>

      <Marquee text={t('home.marquee')} />

      {/* PHILOSOPHY */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest2 uppercase text-steelLight mb-4"
        >
          {t('home.philosophy_eyebrow')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl sm:text-5xl leading-tight mb-6"
        >
          {t('home.philosophy_title')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-mist/60 text-base sm:text-lg leading-relaxed"
        >
          {t('home.philosophy_text')}
        </motion.p>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest2 uppercase text-steelLight mb-4 text-center"
        >
          {t('home.stats_eyebrow')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-2xl sm:text-4xl text-center mb-14 max-w-2xl mx-auto"
        >
          {t('home.stats_title')}
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
          {[1, 2, 3, 4].map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-display steel-gradient-text text-4xl sm:text-5xl mb-2">
                <Counter value={t(`home.stat_${n}_value`)} />
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-widest2 text-mist/50">
                {t(`home.stat_${n}_label`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-xs mx-auto divider-line" />

      {/* MECHANISM SCROLL VIDEO */}
      <ScrollVideoReveal />

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-widest2 uppercase text-steelLight mb-3">{t('home.featured_eyebrow')}</p>
              <h2 className="font-display text-3xl sm:text-4xl">{t('home.featured_title')}</h2>
            </div>
            <Link to="/catalog" className="hidden sm:block text-sm uppercase tracking-wide text-mist/50 hover:text-steelLight transition-colors">
              {t('home.featured_cta')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* VALUES */}
      <section className="bg-graphite py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-center mb-16">{t('home.values_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {[1, 2, 3].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 h-14 w-14 rounded-full border border-steelLight/40 flex items-center justify-center font-display text-xl text-steelLight">
                  {n}
                </div>
                <h3 className="font-display text-xl mb-2">{t(`home.value_${n}_title`)}</h3>
                <p className="text-mist/55 text-sm leading-relaxed max-w-xs mx-auto">{t(`home.value_${n}_text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
