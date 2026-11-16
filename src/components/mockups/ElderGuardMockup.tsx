import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

const COUNT = 10

/** Reloj redondo estilo Garmin Forerunner 165: bisel negro, 5 botones, pantalla AMOLED, pulso y simulación de caída */
export function ElderGuardMockup({ active = true }: { active?: boolean }) {
  const { t } = useI18n()
  const m = t.projects.mockup
  const [now, setNow] = useState(() => new Date())
  const [fall, setFall] = useState<number | null>(null)
  const [bpm, setBpm] = useState(72)

  useEffect(() => {
    if (!active) return
    let tick = 0
    const id = setInterval(() => {
      tick++
      setNow(new Date())
      setBpm(70 + Math.round(Math.sin(tick / 2) * 4))
      // Cada ~16 s simula una caída con cuenta regresiva
      const cycle = tick % 16
      setFall(cycle >= 6 ? COUNT - (cycle - 6) : null)
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const R = 46
  const C = 2 * Math.PI * R

  return (
    <div className="relative grid size-full place-items-center" style={{ perspective: 1000 }}>
      <motion.div
        className="relative aspect-square h-[78%] max-h-[340px] preserve-3d"
        animate={active ? { rotateY: [-14, 12, -14], rotateX: [10, 4, 10] } : { rotateX: 8 }}
        transition={{ duration: 10, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* Correa de silicona */}
        <div className="absolute top-[-24%] bottom-[-24%] left-1/2 -z-10 w-[48%] -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-[#26262a] via-[#141416] to-[#26262a]" style={{ transform: 'translateZ(-20px)' }} />
        {/* 5 botones: 3 a la izquierda (luz, arriba, abajo) y 2 a la derecha (start/stop, atrás) */}
        {[24, 50, 76].map((top) => (
          <span key={`l${top}`} className="absolute -left-[3.5%] h-[8%] w-[5%] -translate-y-1/2 rounded-l-md bg-gradient-to-r from-[#3a3a3f] to-[#1c1c1f]" style={{ top: `${top}%` }} />
        ))}
        {[30, 70].map((top, i) => (
          <span
            key={`r${top}`}
            className={`absolute -right-[3.5%] h-[8%] w-[5%] -translate-y-1/2 rounded-r-md ${i === 0 ? 'bg-gradient-to-l from-[#c81e2e] to-[#7a0f19]' : 'bg-gradient-to-l from-[#3a3a3f] to-[#1c1c1f]'}`}
            style={{ top: `${top}%` }}
          />
        ))}
        {/* Bisel negro */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3b3b40] via-[#0c0c0e] to-[#2a2a2e] p-[6%] shadow-2xl ring-1 ring-black">
          <div className="relative size-full overflow-hidden rounded-full bg-black text-white ring-2 ring-[#1d1d20]">
            {/* Reflejo del cristal */}
            <span className="pointer-events-none absolute -top-1/4 -left-1/4 z-10 size-3/4 rounded-full bg-white/[0.05] blur-md" />
            {fall === null ? (
              <div className="flex size-full flex-col items-center justify-center">
                <p className="font-mono text-[9px] tracking-widest text-white/75">ELDERGUARD</p>
                <p className="font-display text-[clamp(2.3rem,5.2vw,3.3rem)] leading-[0.95] font-extrabold tracking-tight tabular-nums">
                  {hh}:{mm}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-base font-extrabold">
                  <motion.span animate={active ? { scale: [1, 1.3, 1] } : undefined} transition={{ duration: 0.85, repeat: Infinity }}>
                    <Heart size={14} className="fill-[#ff3b4e] text-[#ff3b4e]" />
                  </motion.span>
                  {bpm} <span className="text-[9px] font-normal text-white/60">{m.bpm}</span>
                </div>
                <svg viewBox="0 0 120 30" className="mt-1 w-[62%]" aria-hidden="true">
                  <motion.path
                    d="M0 15 H30 L36 15 L40 4 L45 26 L50 15 H70 L74 9 L78 15 H120"
                    fill="none"
                    stroke="#ff3b4e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: active ? [0, 1, 1] : 1, opacity: active ? [1, 1, 0] : 1 }}
                    transition={{ duration: 1.6, repeat: active ? Infinity : 0, times: [0, 0.7, 1] }}
                  />
                </svg>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-white/70">
                  <span className="relative h-2 w-4 rounded-[2px] border border-white/60">
                    <span className="absolute inset-[1px] right-[25%] rounded-[1px] bg-[#4ade80]" />
                  </span>
                  78%
                </div>
                <span className="mt-1.5 rounded-full bg-[#e11d2e] px-2.5 py-0.5 text-[9px] font-extrabold">{m.sos}</span>
              </div>
            ) : (
              <div className="relative flex size-full flex-col items-center justify-center bg-[#2a0508]">
                <svg viewBox="0 0 100 100" className="absolute inset-[6%] -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="4" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r={R}
                    fill="none"
                    stroke="#ff3b4e"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    animate={{ strokeDashoffset: C * (1 - fall / COUNT) }}
                    transition={{ duration: 0.9, ease: 'linear' }}
                  />
                </svg>
                <p className="text-[10px] font-bold tracking-wide text-[#ff9aa4] uppercase">{m.fall}</p>
                <motion.p key={fall} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-5xl leading-none font-extrabold">
                  {fall}
                </motion.p>
                <span className="mt-2 rounded-full border border-white/40 px-3 py-0.5 text-[9px] font-semibold">{m.cancel}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
