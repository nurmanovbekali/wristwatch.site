import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'

export default function NotFound() {
  const { t } = useLang()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 pt-32 sm:pt-40 pb-24">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display text-7xl sm:text-9xl steel-gradient-text animate-shimmer mb-4"
      >
        404
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-mist/60 max-w-sm mb-8"
      >
        {t('notfound.text')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-mist text-void px-8 py-3.5 rounded-full text-sm tracking-widest2 uppercase hover:bg-steelLight transition-colors duration-500"
        >
          {t('notfound.back_home')}
        </Link>
      </motion.div>
    </div>
  )
}
