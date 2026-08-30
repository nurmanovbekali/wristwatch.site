// Toza, minimal wordmark logotip — WRK uslubida, ikonkasiz, faqat aniq tipografiya.
export default function Logo({ className = '', variant = 'full' }) {
  if (variant === 'mark') {
    return (
      <span className={`font-display font-semibold tracking-tight ${className}`}>
        WW
      </span>
    )
  }
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      WRISTWATCH<span className="text-steel">.UZ</span>
    </span>
  )
}
