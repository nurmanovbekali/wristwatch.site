import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/index.jsx'
import { supabase } from '../lib/supabaseClient'
import { formatPrice, submitOrder } from '../lib/utils'

export default function ProductDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true)
        } else {
          setProduct(data)
        }
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitOrder({ product, name, phone })
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (loading) return <div className="pt-40 pb-24 text-center text-mist/40">{t('catalog.loading')}</div>

  if (notFound || !product) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-mist/60 mb-6">{t('product.not_found')}</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-mist text-void px-8 py-3.5 rounded-full text-sm tracking-widest2 uppercase hover:bg-steelLight transition-colors duration-500"
        >
          {t('product.back')}
        </Link>
      </div>
    )
  }

  const productName = product[`name_${lang}`] || product.name_uz
  const description = product[`description_${lang}`] || product.description_uz

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-32 sm:pt-40 pb-24">
      <Link to="/catalog" className="text-sm text-mist/50 hover:text-steelLight transition-colors">
        ← {t('product.back')}
      </Link>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl overflow-hidden bg-graphite aspect-square"
        >
          <img
            src={product.image_url}
            alt={productName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
          <div className="hidden h-full w-full items-center justify-center text-mist/20 text-xs uppercase tracking-widest2">
            {t('product.image_unavailable')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <p className="text-xs uppercase tracking-widest2 text-steelLight mb-3">{product.category}</p>
          <h1 className="font-display text-3xl sm:text-4xl mb-4">{productName}</h1>
          <p className="text-2xl text-steelLight font-medium mb-6">{formatPrice(product.price)}</p>

          {description && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest2 text-mist/40 mb-2">{t('product.description')}</h3>
              <p className="text-mist/65 leading-relaxed">{description}</p>
            </div>
          )}

          {!showForm && status !== 'done' && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-void text-mist hover:bg-steelLight hover:text-void transition-colors duration-500 px-8 py-3.5 rounded-full text-sm tracking-widest2 uppercase"
            >
              {t('product.order_now')}
            </button>
          )}

          <AnimatePresence>
            {showForm && status !== 'done' && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden flex flex-col gap-4 mt-2"
              >
                <p className="text-sm text-mist/50">{t('product.order_note')}</p>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('admin.name')}
                  className="px-4 py-3 rounded-xl border border-line/15 bg-transparent focus:border-steelLight outline-none"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="px-4 py-3 rounded-xl border border-line/15 bg-transparent focus:border-steelLight outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-steelLight text-void hover:bg-mist transition-colors duration-500 px-8 py-3.5 rounded-full text-sm tracking-widest2 uppercase disabled:opacity-50"
                >
                  {status === 'sending' ? '...' : t('product.order_via_telegram')}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-red-500">Xatolik yuz berdi, qaytadan urinib ko'ring.</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 rounded-xl border border-steelLight/40 bg-steelLight/5 p-6 text-center"
            >
              <p className="font-display text-xl text-steelLight mb-1">✓</p>
              <p className="text-mist/70">Buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <SpecBreakdown product={product} t={t} />
    </div>
  )
}

function SpecBreakdown({ product, t }) {
  const specs = [
    { key: 'case_material', label: 'A', name: t('product.spec_case') },
    { key: 'strap_material', label: 'B', name: t('product.spec_strap') },
    { key: 'movement', label: 'C', name: t('product.spec_movement') },
    { key: 'water_resistance', label: 'D', name: t('product.spec_water') },
    { key: 'diameter', label: 'E', name: t('product.spec_diameter') },
    { key: 'weight', label: 'F', name: t('product.spec_weight') },
  ].filter((s) => product[s.key])

  if (specs.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-20 sm:mt-28 pt-14 border-t border-line"
    >
      <p className="text-xs uppercase tracking-widest2 text-steel mb-2">{t('product.spec_eyebrow')}</p>
      <h2 className="font-display text-2xl sm:text-3xl mb-10">{t('product.spec_title')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {specs.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="flex items-center gap-4 py-3 border-b border-line/60"
          >
            <span className="callout-marker">{s.label}</span>
            <div className="flex-1 flex items-baseline justify-between gap-4">
              <span className="text-sm text-steel uppercase tracking-wide">{s.name}</span>
              <span className="text-mist font-medium text-right">{product[s.key]}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
