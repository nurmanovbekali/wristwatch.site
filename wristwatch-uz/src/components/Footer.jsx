import { Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-graphite text-mist/80 border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="mb-3">
            <Logo className="text-xl text-mist" />
          </div>
          <p className="text-xs text-steel tracking-widest2 uppercase">{t('footer.tagline')}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-mist text-steel transition-colors">{t('nav.home')}</Link>
          <Link to="/catalog" className="hover:text-mist text-steel transition-colors">{t('nav.catalog')}</Link>
          <Link to="/about" className="hover:text-mist text-steel transition-colors">{t('nav.about')}</Link>
          <Link to="/contact" className="hover:text-mist text-steel transition-colors">{t('nav.contact')}</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a href="tel:+998332311101" className="hover:text-mist text-steel transition-colors">+998 33 231 11 01</a>
          <a href="https://t.me/wristwatchuzbb" target="_blank" rel="noreferrer" className="hover:text-mist text-steel transition-colors">Telegram</a>
          <a href="https://www.instagram.com/wristwatch__uz/" target="_blank" rel="noreferrer" className="hover:text-mist text-steel transition-colors">Instagram</a>
          <a href="https://youtube.com/@WRISTWATCHUZ" target="_blank" rel="noreferrer" className="hover:text-mist text-steel transition-colors">YouTube</a>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-steel">
        © {year} WRISTWATCH.UZ — {t('footer.rights')}
      </div>
    </footer>
  )
}
