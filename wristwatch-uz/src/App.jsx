import { useState, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import IntroLoader from './components/IntroLoader.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageTransition from './components/PageTransition.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Admin panel oddiy tashrifchilarga umuman kerak emas — uni alohida
// "chunk" sifatida faqat /admin ochilganda yuklaymiz. Bu asosiy sayt
// (ayniqsa mobil, sekin internet) tezroq ochilishiga yordam beradi.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const AdminStats = lazy(() => import('./pages/admin/AdminStats.jsx'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'))

function AdminFallback() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-line border-t-steelLight animate-spin" />
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdmin && !introDone && <IntroLoader onFinish={() => setIntroDone(true)} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PublicLayout>
                <PageTransition><Home /></PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/catalog"
            element={
              <PublicLayout>
                <PageTransition><Catalog /></PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PublicLayout>
                <PageTransition><ProductDetail /></PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <PageTransition><About /></PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <PageTransition><Contact /></PageTransition>
              </PublicLayout>
            }
          />

          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route path="/admin/dashboard" element={<AdminStats />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>

          <Route
            path="*"
            element={
              <PublicLayout>
                <PageTransition><NotFound /></PageTransition>
              </PublicLayout>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}
