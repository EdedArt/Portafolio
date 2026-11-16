import { motion } from 'framer-motion'
import { Car, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

/** Teléfono 3D con el seguimiento del lavado */
export function AutoCleanMockup({ active = true }: { active?: boolean }) {
  const { t } = useI18n()
  const m = t.projects.mockup
  const [phase, setPhase] = useState(1)

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setPhase((p) => (p + 1) % m.phases.length), 1700)
    return () => clearInterval(id)
  }, [active, m.phases.length])

  const pct = (phase / (m.phases.length - 1)) * 100
  const minutes = Math.max(0, 24 - phase * 6)
  const done = phase === m.phases.length - 1

  return (
    <div className="relative grid size-full place-items-center" style={{ perspective: 1100 }}>
      <motion.div
        className="relative h-[86%] max-h-[420px] aspect-[9/19] preserve-3d"
        animate={active ? { rotateY: [-18, 14, -18], rotateX: [6, -2, 6] } : { rotateY: -12, rotateX: 4 }}
        transition={{ duration: 9, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* Grosor del teléfono */}
        <div className="absolute inset-0 rounded-[2.2rem] bg-[#2a2226]" style={{ transform: 'translateZ(-10px)' }} />
        <div className="absolute inset-0 rounded-[2.2rem] border-[6px] border-[#1a1417] bg-[#0f0b0d] p-1 shadow-2xl">
          <div className="relative size-full overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-[#1b1417] to-[#100c0e] px-3 pt-7 text-white">
            <span className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
            <p className="text-center font-mono text-[8px] tracking-widest text-white/70">AUTOCLEAN AI</p>
            {/* Placa */}
            <div className="mx-auto mt-3 w-[88%] rounded-md border-2 border-black bg-[#f8d038] px-2 py-1 text-center text-black shadow-lg">
              <p className="font-mono text-[6px] font-bold tracking-widest">PASTO · COLOMBIA</p>
              <p className="font-display text-lg leading-none font-extrabold tracking-wider">NAR 482</p>
            </div>
            <p className="mt-1 text-center text-[8px] text-white/70">
              {m.plate} · {m.bay}
            </p>

            {/* Carro con burbujas */}
            <div className="relative mx-auto mt-3 grid h-20 place-items-center overflow-hidden rounded-xl bg-white/[0.04]">
              <Car size={44} className="text-[#ff5a6a]" />
              {active &&
                Array.from({ length: 9 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute bottom-0 rounded-full border border-sky-200/70 bg-sky-200/20"
                    style={{ left: `${8 + i * 10}%`, width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4 }}
                    animate={{ y: [0, -90], opacity: [0, 1, 0], x: [0, i % 2 ? 6 : -6] }}
                    transition={{ duration: 2.4 + (i % 4) * 0.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                  />
                ))}
            </div>

            {/* Fases */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px]">
                <span className="font-semibold text-[#ff5a6a]">{m.phases[phase]}</span>
                <span className="text-white/60">{Math.round(pct)}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#e11d2e] to-[#ff7a59]" animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <ol className="mt-2 space-y-1">
                {m.phases.map((p, i) => (
                  <li key={p} className="flex items-center gap-1.5 text-[8.5px]">
                    <span
                      className={`grid size-3 place-items-center rounded-full ${
                        i < phase ? 'bg-[#e11d2e]' : i === phase ? 'bg-[#ff5a6a] ring-2 ring-[#ff5a6a]/40' : 'bg-white/15'
                      }`}
                    >
                      {i < phase && <Check size={7} strokeWidth={4} />}
                    </span>
                    <span className={i <= phase ? 'text-white' : 'text-white/65'}>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-lg bg-white/[0.06] p-2 text-center">
              <p className="text-[7px] text-white/70 uppercase">{m.eta}</p>
              <p className="font-display text-sm font-extrabold">{done ? '✓' : `${minutes} min`}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
