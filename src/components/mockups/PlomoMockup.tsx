import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { PointerEvent } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Póster de caricatura de los años 30 con paralaje por capas */
export function PlomoMockup({ active = true }: { active?: boolean }) {
  const { t } = useI18n()
  const m = t.projects.mockup
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 18 })
  const sy = useSpring(my, { stiffness: 120, damping: 18 })
  const layer = (d: number) => ({
    x: useTransform(sx, (v) => v * d),
    y: useTransform(sy, (v) => v * d),
  })
  const back = layer(-8)
  const mid = layer(10)
  const front = layer(22)
  const rotY = useTransform(sx, [-1, 1], [-8, 8])
  const rotX = useTransform(sy, [-1, 1], [6, -6])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <div className="grid size-full place-items-center" style={{ perspective: 1000 }} onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0) }}>
      <motion.div
        className="relative h-[90%] aspect-[3/4] overflow-hidden rounded-md border-[6px] border-[#e9e2d3] bg-[#d8d1c2] shadow-2xl preserve-3d"
        style={{ rotateX: rotX, rotateY: rotY, filter: 'grayscale(1) contrast(1.1)' }}
      >
        <div className={`absolute inset-0 ${active ? 'animate-flicker' : ''}`}>
          {/* Rayos de fondo */}
          <motion.svg style={back} viewBox="0 0 300 400" className="absolute -inset-[8%] size-[116%]" aria-hidden="true">
            <defs>
              <radialGradient id="pp-bg" cx="50%" cy="45%" r="70%">
                <stop offset="0" stopColor="#f3eee3" />
                <stop offset="1" stopColor="#8d877b" />
              </radialGradient>
            </defs>
            <rect width="300" height="400" fill="url(#pp-bg)" />
            {Array.from({ length: 18 }).map((_, i) => (
              <path key={i} d={`M150 180 L${150 + Math.cos((i / 18) * Math.PI * 2) * 400} ${180 + Math.sin((i / 18) * Math.PI * 2) * 400} L${150 + Math.cos(((i + 0.5) / 18) * Math.PI * 2) * 400} ${180 + Math.sin(((i + 0.5) / 18) * Math.PI * 2) * 400}Z`} fill="#000" opacity="0.06" />
            ))}
            {/* Casa de paja */}
            <g transform="translate(176 190)" opacity="0.85">
              <path d="M0 60 L48 10 L96 60 Z" fill="#3b3833" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1={8 + i * 7} y1={58} x2={30 + i * 3} y2={22} stroke="#bdb6a6" strokeWidth="1" />
              ))}
              <rect x="10" y="58" width="76" height="52" fill="#57524a" />
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={i} x1={14 + i * 7.5} y1={60} x2={12 + i * 7.5} y2={108} stroke="#9b9486" strokeWidth="1" />
              ))}
              <rect x="38" y="80" width="20" height="30" fill="#1b1916" />
              {/* Paja caída */}
              <path d="M-10 112 Q20 104 50 112 T110 112" stroke="#2a2723" strokeWidth="3" fill="none" />
            </g>
            <rect y="300" width="300" height="100" fill="#4a463f" />
          </motion.svg>

          {/* Cerdito detective */}
          <motion.svg style={mid} viewBox="0 0 300 400" className="absolute inset-0 size-full" aria-hidden="true">
            <g fill="#111">
              {/* Gabardina */}
              <path d="M70 400 L88 268 Q120 236 150 236 Q180 236 212 268 L230 400 Z" />
              <path d="M150 240 L132 300 L150 290 L168 300 Z" fill="#e8e2d6" />
              {/* Cabeza */}
              <ellipse cx="150" cy="190" rx="54" ry="50" />
              {/* Orejas */}
              <path d="M98 160 L92 126 L122 148 Z" />
              <path d="M202 160 L208 126 L178 148 Z" />
              {/* Sombrero */}
              <ellipse cx="150" cy="148" rx="84" ry="14" />
              <path d="M98 148 Q100 92 150 90 Q200 92 202 148 Z" />
              <rect x="100" y="132" width="100" height="10" fill="#2e2c29" />
            </g>
            {/* Hocico y ojos */}
            <ellipse cx="150" cy="208" rx="22" ry="15" fill="#d6cfc1" />
            <ellipse cx="143" cy="208" rx="4" ry="6" fill="#111" />
            <ellipse cx="157" cy="208" rx="4" ry="6" fill="#111" />
            <circle cx="128" cy="178" r="6" fill="#e8e2d6" />
            <circle cx="172" cy="178" r="6" fill="#e8e2d6" />
            <motion.g animate={active ? { scaleY: [1, 1, 0.1, 1] } : undefined} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }} style={{ originY: '178px' }}>
              <circle cx="129" cy="179" r="3" fill="#111" />
              <circle cx="173" cy="179" r="3" fill="#111" />
            </motion.g>
          </motion.svg>

          {/* Título */}
          <motion.div style={front} className="absolute inset-x-0 top-[5%] text-center text-[#111]">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase">{m.posterTop}</p>
            <p
              className="mx-auto mt-1 w-fit -rotate-3 rounded-sm bg-[#111] px-3 pb-1 font-serif text-[clamp(1.6rem,4vw,2.6rem)] leading-none text-[#f3eee3] italic"
              style={{ textShadow: '2px 2px 0 #7a7468' }}
            >
              {m.posterTitle}
            </p>
          </motion.div>
          <motion.p style={front} className="absolute inset-x-0 bottom-[4%] text-center font-display text-[10px] font-extrabold tracking-[0.25em] text-[#f3eee3] uppercase">
            {m.posterBottom}
          </motion.p>
        </div>

        {/* Grano, viñeta y rayas de proyector */}
        <div className={`pointer-events-none absolute -inset-[20%] opacity-30 mix-blend-multiply ${active ? 'animate-grain' : ''}`} style={{ backgroundImage: NOISE }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.55) 100%)' }} />
        {active && (
          <motion.span
            className="pointer-events-none absolute inset-y-0 w-px bg-black/40"
            animate={{ left: ['12%', '70%', '35%', '88%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>
    </div>
  )
}
