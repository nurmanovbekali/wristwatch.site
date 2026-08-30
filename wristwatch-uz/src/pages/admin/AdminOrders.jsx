import { useEffect, useState } from 'react'
import { useLang } from '../../i18n/index.jsx'
import { supabase } from '../../lib/supabaseClient'
import { formatPrice } from '../../lib/utils'

export default function AdminOrders() {
  const { t } = useLang()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [errorMsg, setErrorMsg] = useState('')

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      setErrorMsg(t('admin.load_error'))
    }
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleStatus(order) {
    const next = order.status === 'new' ? 'done' : 'new'
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', order.id)
    if (error) {
      console.error(error)
      alert(t('admin.save_error'))
      return
    }
    load()
  }

  return (
    <div>
      <h1 className="font-display text-2xl sm:text-3xl mb-8">{t('admin.orders')}</h1>

      {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

      {loading ? (
        <p className="text-void/40">...</p>
      ) : orders.length === 0 ? (
        <p className="text-void/40">{t('admin.no_orders')}</p>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-void/40 uppercase text-xs border-b border-void/10">
                <th className="py-3 px-3">{t('admin.order_date')}</th>
                <th className="py-3 px-3">{t('admin.order_product')}</th>
                <th className="py-3 px-3">{t('admin.order_customer')}</th>
                <th className="py-3 px-3">{t('admin.order_status')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-void/5 hover:bg-void/5">
                  <td className="py-3 px-3 whitespace-nowrap text-void/60">
                    {new Date(o.created_at).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium">{o.product_name}</p>
                    <p className="text-steelLight text-xs">{formatPrice(o.product_price)}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p>{o.customer_name || '-'}</p>
                    <p className="text-void/40 text-xs">{o.customer_phone || '-'}</p>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleStatus(o)}
                      className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide transition-colors ${
                        o.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-steelLight/15 text-steelLight'
                      }`}
                    >
                      {o.status === 'done' ? t('admin.status_done') : t('admin.status_new')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
