import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useLang } from '../../i18n/index.jsx'
import { supabase } from '../../lib/supabaseClient'
import Logo from '../../components/Logo.jsx'

export default function AdminLayout() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined) // undefined = loading, null = no session

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session === null) navigate('/admin')
  }, [session, navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (session === undefined) {
    return <div className="min-h-screen bg-void flex items-center justify-center text-mist/50">...</div>
  }
  if (!session) return null

  const links = [
    { to: '/admin/dashboard', label: t('admin.dashboard') },
    { to: '/admin/products', label: t('admin.products') },
    { to: '/admin/orders', label: t('admin.orders') },
  ]

  return (
    <div className="min-h-screen bg-mist flex flex-col md:flex-row">
      <aside className="md:w-60 bg-void text-mist flex md:flex-col justify-between md:justify-start px-4 md:px-6 py-4 md:py-8 sticky top-0 z-20">
        <div className="flex items-center gap-2.5 md:mb-10">
          <Logo className="text-lg" />
        </div>
        <nav className="flex md:flex-col gap-2 md:gap-1 flex-1 md:flex-none justify-center">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-steelLight/15 text-steel' : 'text-mist/60 hover:text-mist hover:bg-mist/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="text-sm text-mist/50 hover:text-red-400 transition-colors px-4 py-2.5"
        >
          {t('admin.logout')}
        </button>
      </aside>

      <main className="flex-1 px-5 sm:px-8 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
