import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Har bir yangi sahifaga o'tganda scroll pozitsiyasini yuqoriga qaytaradi.
// "instant" ishlatiladi, chunki global "smooth scroll" bilan birga sahifa
// o'tish animatsiyasi (blur/fade) davomida sekin aylanib qolishining oldini oladi.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
