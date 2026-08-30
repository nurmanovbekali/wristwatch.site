import { motion } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'

export default function About() {
  const { t } = useLang()

  const careItems = [1, 2, 3, 4]
  const values = t('about.values')

  return (
    <div>
      {/* HERO */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-32 sm:pt-44 pb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm tracking-widest2 uppercase text-steelLight mb-5"
        >
          {t('about.eyebrow')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl leading-tight mb-7"
        >
          {t('about.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-mist/60 text-base sm:text-lg leading-relaxed"
        >
          {t('about.intro')}
        </motion.p>
      </section>

      {/* MISSION / VISION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
          {['mission', 'vision'].map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-graphite rounded-2xl p-8 sm:p-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl mb-4 text-steelLight">
                {t(`about.${key}_title`)}
              </h2>
              <p className="text-mist/65 leading-relaxed">{t(`about.${key}_text`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CRAFTSMANSHIP / ANATOMY */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest2 uppercase text-steelLight mb-3">{t('about.craft_eyebrow')}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{t('about.craft_title')}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5].map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-steelLight/40 flex items-center justify-center font-display text-sm text-steelLight">
                {String(n).padStart(2, '0')}
              </div>
              <h3 className="font-display text-base mb-1">{t(`about.craft_${n}_title`)}</h3>
              <p className="text-xs uppercase tracking-wide text-steelLight/80 mb-2">{t(`about.craft_${n}_material`)}</p>
              <p className="text-mist/50 text-xs leading-relaxed">{t(`about.craft_${n}_text`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH FACTS */}
      <section className="bg-void text-mist pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest2 uppercase text-mist mb-3">{t('about.facts_eyebrow')}</p>
            <h2 className="font-display text-3xl sm:text-4xl">{t('about.facts_title')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            {[1, 2, 3, 4].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-2xl sm:text-3xl text-mist mb-2">{t(`about.facts_${n}_value`)}</p>
                <p className="text-xs uppercase tracking-wide text-mist/50">{t(`about.facts_${n}_label`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest2 uppercase text-steelLight mb-3">{t('about.timeline_eyebrow')}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{t('about.timeline_title')}</h2>
        </div>
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-steelLight/25" />
          <div className="flex flex-col gap-12">
            {[1, 2, 3, 4].map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                <span className="absolute -left-8 sm:-left-10 top-1 h-3 w-3 rounded-full bg-steelLight ring-4 ring-mist" />
                <p className="text-xs tracking-widest2 uppercase text-steelLight mb-2">{t(`about.timeline_${n}_year`)}</p>
                <p className="text-mist/65 leading-relaxed">{t(`about.timeline_${n}_text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-void text-mist pb-24 sm:pb-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl sm:text-4xl mb-6 steel-gradient-text"
          >
            {t('about.philosophy_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-mist/60 text-base sm:text-lg leading-relaxed"
          >
            {t('about.philosophy_text')}
          </motion.p>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <h2 className="font-display text-3xl sm:text-4xl text-center mb-14">{t('about.values_title')}</h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {Array.isArray(values) &&
            values.map((v, i) => (
              <motion.span
                key={v}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border border-steelLight/40 text-steelLight px-5 py-2.5 rounded-full text-sm sm:text-base font-display"
              >
                {v}
              </motion.span>
            ))}
        </div>
      </section>

      {/* WATCH CARE */}
      <section className="bg-graphite pt-16 sm:pt-20 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest2 uppercase text-steelLight mb-3">{t('about.care_eyebrow')}</p>
            <h2 className="font-display text-3xl sm:text-4xl">{t('about.care_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {careItems.map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-void text-mist flex items-center justify-center font-display text-lg">
                  {n}
                </div>
                <div>
                  <h3 className="font-display text-lg mb-1.5">{t(`about.care_${n}_title`)}</h3>
                  <p className="text-mist/60 text-sm leading-relaxed">{t(`about.care_${n}_text`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOVEMENT TYPES */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-28 sm:pb-36 text-center">
        <p className="text-xs tracking-widest2 uppercase text-steelLight mb-3">{t('about.types_eyebrow')}</p>
        <h2 className="font-display text-3xl sm:text-4xl mb-6">{t('about.types_title')}</h2>
        <p className="text-mist/60 leading-relaxed">{t('about.types_text')}</p>
      </section>
    </div>
  )
}
