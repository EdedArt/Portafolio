import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

const COUNT = 10

/** Reloj redondo tipo Garmin con ECG y simulación de caída */
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
        {/* Correa */}
        <div className="absolute top-[-22%] bottom-[-22%] left-1/2 -z-10 w-[46%] -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-[#2a2226] via-[#1a1417] to-[#2a2226]" style={{ transform: 'translateZ(-20px)' }} />
        {/* Botones laterales */}
        {[22, 50, 72].map((top) => (
          <span key={top} className="absolute -right-[3%] h-[9%] w-[5%] rounded-sm bg-[#3a3034]" style={{ top: `${top}%` }} />
        ))}
        {/* Bisel */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4a4045] via-[#1e181b] to-[#3a3034] p-[5%] shadow-2xl">
          <div className="relative size-full overflow-hidden rounded-full bg-black text-white">
            {fall === null ? (
              <div className="flex size-full flex-col items-center justify-center">
                <p className="font-mono text-[9px] tracking-widest text-white/50">ELDERGUARD</p>
                <p className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-none font-extrabold tabular-nums">
                  {hh}:{mm}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-bold">
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
