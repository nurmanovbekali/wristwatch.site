export default function Marquee({ text }) {
  return (
    <div className="relative overflow-hidden bg-void py-4 select-none">
      <div className="marquee-track animate-marquee">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center shrink-0">
            {Array.from({ length: 6 }).map((_, j) => (
              <span
                key={j}
                className="font-display text-xl sm:text-2xl tracking-wide text-mist/80 whitespace-nowrap px-4"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
