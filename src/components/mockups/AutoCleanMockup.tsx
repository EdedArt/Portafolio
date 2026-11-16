import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useTheme } from '../../theme/ThemeProvider'

type Step = { src: string; step: number; pct?: number }

// Buscar y remojo solo existen en claro: en modo oscuro se muestran lavado y secado.
const LIGHT: Step[] = [
  { src: '/proyectos/autoclean-buscar.webp', step: 0 },
  { src: '/proyectos/autoclean-remojo-light.webp', step: 1, pct: 30 },
  { src: '/proyectos/autoclean-lavado-light.webp', step: 2, pct: 55 },
  { src: '/proyectos/autoclean-secado-light.webp', step: 3, pct: 80 },
]
const DARK: Step[] = [
  { src: '/proyectos/autoclean-lavado-dark.webp', step: 2, pct: 55 },
  { src: '/proyectos/autoclean-secado-dark.webp', step: 3, pct: 80 },
]

/** Marco de teléfono con bisel y notch */
export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[1.6rem] bg-[#0f0d10] p-[5%] shadow-[0_30px_50px_-20px_rgba(0,0,0,.6)] ring-1 ring-white/10 ${className}`}>
      {/* Botones laterales */}
      <span className="absolute top-[22%] -right-[3px] h-[12%] w-[3px] rounded-r bg-[#2a2629]" />
      <span className="absolute top-[18%] -left-[3px] h-[7%] w-[3px] rounded-l bg-[#2a2629]" />
      <span className="absolute top-[28%] -left-[3px] h-[7%] w-[3px] rounded-l bg-[#2a2629]" />
      <div className="relative size-full overflow-hidden rounded-[1.15rem] bg-white dark:bg-[#0b1220]">
        <span className="absolute top-[1.6%] left-1/2 z-10 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-[#0f0d10]" />
        {children}
      </div>
    </div>
  )
}

/** Capturas reales de AutoClean AI en secuencia dentro de un teléfono 3D */
export function AutoCleanMockup({ active = true }: { active?: boolean }) {
  const { theme } = useTheme()
  const { t } = useI18n()
  const seq = theme === 'dark' ? DARK : LIGHT
  const [i, setI] = useState(0)

  useEffect(() => setI(0), [theme])
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setI((v) => (v + 1) % seq.length), 2200)
    return () => clearInterval(id)
  }, [active, seq.length])

  const cur = seq[i % seq.length]
  const label = t.projects.mockup.acSteps[cur.step]

  return (
    <div className="relative grid size-full place-items-center" style={{ perspective: 1000 }}>
      {/* Teléfono trasero, más pequeño y desenfocado */}
      <div className="absolute aspect-[214/464] h-[62%] max-w-[150px] -translate-x-[62%] -translate-y-[4%] -rotate-[9deg] opacity-60 blur-[1.5px]" aria-hidden="true">
        <PhoneFrame className="size-full">
          <img src="/proyectos/autoclean-login.webp" alt="" width={214} height={464} loading="lazy" decoding="async" className="size-full object-cover object-top" />
        </PhoneFrame>
      </div>

      {/* Teléfono principal: máximo 232 px de ancho para no ampliar las capturas */}
      <motion.div
        className="relative aspect-[9/19] h-[86%] max-h-[490px] max-w-[232px]"
        animate={active ? { rotateY: [-14, -4, -14], y: [0, -6, 0] } : { rotateY: -8 }}
        transition={{ duration: 8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      >
        <PhoneFrame className="size-full">
          <AnimatePresence initial={false}>
            <motion.img
              key={cur.src}
              src={cur.src}
              alt=""
              width={213}
              height={450}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute inset-0 size-full object-cover object-top"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </PhoneFrame>

        {/* Fase actual */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={cur.src}
            className="absolute top-[16%] left-[78%] flex items-center gap-1.5 rounded-full bg-[#0f0d10]/85 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-white shadow-lg backdrop-blur"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.3 }}
          >
            <span className="size-1.5 rounded-full bg-[#22d3ee]" />
            {label}
            {cur.pct !== undefined && <span className="text-[#67e8f9]">{cur.pct} %</span>}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
